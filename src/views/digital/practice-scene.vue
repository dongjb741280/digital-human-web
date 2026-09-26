<template>
  <el-container class="full-screen-layout">
    <el-row class="screen-height">
      <!-- 左侧列 -->
      <el-col :span="12" class="half-screen">
        <el-card shadow="hover" class="full-height">
          <template #header>
            <div class="card-header">
              <span>场景对练</span>
            </div>
          </template>
          <div class="card-content">
            <el-form
              ref="formRef"
              :model="formData"
              label-width="115px"
              :rules="rules">
              <el-form-item label="场景选择:" prop="id">
                <el-select v-model="formData.id" placeholder="请选择场景">
                  <!-- 提供选项列表 -->
                  <el-option
                    v-for="option in sceneOptions"
                    :key="option.id"
                    :label="option.agentName"
                    :value="option.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="对练场景描述:" prop="query">
                <el-input
                  type="textarea"
                  :rows="6"
                  v-model="formData.query"
                  placeholder="请输入对练场景描述"
                />
              </el-form-item>
              <el-form-item label="生成数量:" prop="quantity">
                <el-input-number v-model="formData.quantity"
                                 :min="1"
                                 :max="100"
                                 controls-position="right"
                                 placeholder="请输入生成数量"
                                 style="width: 100%"
                                 class="input-num-left-align"/>
              </el-form-item>
              <!-- 新增按钮 -->
              <div class="center-button">
                <el-button
                  type="primary"
                  :loading="isLoading"
                  @click="handleSubmit"
                >提交
                </el-button>
              </div>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧列 -->
      <el-col :span="12" class="half-screen">
        <el-row>
          <el-col :span="24">
            <el-card shadow="hover" class="full-height-right">
              <template #header>
                <div class="card-header">
                  <span>场景问答:</span>
                </div>
              </template>
              <div class="card-content2">
                <el-card class="el-card-frame" v-for="(item, index) in languagePracticeList"
                         :key="index">
                  <el-row class="el-row-style">
                    <el-col :span="1.5" class="question">问</el-col>
                    <el-col :span="20" class="light-text">
                      {{ item.question }}
                    </el-col>
                  </el-row>
                  <!-- 添加横线 -->
                  <div class="divider"></div>
                  <el-row class="el-row-style">
                    <el-col :span="1.5" class="answer">答</el-col>
                    <el-col :span="20" class="light-text">
                      {{ item.answer }}
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="22">
                      <el-row class="key-info">关键信息点：</el-row>
                      <el-row class="light-text">{{ item.keyPoints }}</el-row>
                      <!--<el-row class="light-text">引入产品:自然而然地提出FTTR产品作为解决方案。
                      </el-row>-->
                    </el-col>
                    <el-col :span="2">
                      <div class="button-container">
                        <el-button type="null"
                                   size="mini"
                                   :disabled="item.isAdded"
                                   @click="handleAdd(index)"
                                   :class="['add-style', { 'disabled': item.isAdded }]">
                          {{ item.isAdded ? '已添加' : handAddValue }}
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </el-card>
          </el-col>

          <el-col :span="24">
            <div class="center-button2" :style="{ 'justify-content': justifyContentValue }">
              <!-- 添加生成4道题的文字和符号 -->
              <span class="generate-questions2" v-if="answers !== 0">
                <i class="el-icon-success success-icon">✓</i>生成 {{ answers }} 道题
              </span>
              <el-button
                type="primary"
                :loading="isAddAll"
                @click="handleAddAll()"
              >一键入库
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {ElContainer, ElRow, ElCol, ElCard} from 'element-plus';
import * as DigitalPersonApi from '@/api/ai/digitalPerson'

const sceneOptions = ref([]) // 列表的数据
const languagePracticeList = ref([]) // 列表的数据
const formRef = ref() // 表单 Ref
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const isLoading = ref(false);
const handAddValue = ref('添加')
const isAddAll = ref(false)
const answers = ref(0)
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
// 定义一个响应式的变量来控制 justify-content 的值
const justifyContentValue = ref<'flex-end' | 'space-between'>('flex-end');

onMounted(async () => {
  await getAgentList()
})

interface FormData {
  id: string;
  query: string;
  quantity: number;
  inputObj: any;
  conversation_id: string;
}

const formData = ref<FormData>({
  id: '',
  query: '',
  quantity: 0,
  inputObj: {
    input: ''
  },
  conversation_id: ''
});

const rules = {
  id: [{required: true, message: '场景名称为必填项', trigger: 'blur'}],
  query: [{required: true, message: '对练场景描述为必填项', trigger: 'blur'}],
  quantity: [{required: true, message: '生成数量为必填项', trigger: 'blur'}]
};

const getAgentList = async () => {
  try {
    const data = await DigitalPersonApi.getAgentList("2")
    sceneOptions.value = data
    console.log(data)
  } finally {
  }
}

const handleSubmit = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    isLoading.value = true;
    //获取formData里的uploadFiles
    const data = formData.value
    data.inputObj.input = String(formData.value.quantity)
    const result = await DigitalPersonApi.getLanguagePracticeInfo(data)
    console.log(result)
    /*if (result.data === 0) {
      message.success(t('common.createSuccess'))
    }*/
    //如果数组result的长度大于0
    if (result.length > 0) {
      message.success('提交成功！')
      languagePracticeList.value = result
      answers.value = result.length
      justifyContentValue.value = 'space-between';
    } else {
      message.error('从服务器未获取到对练数据，请修改对练场景描述后重试。')
    }
  } finally {
    formLoading.value = false
    isLoading.value = false;
    //formRef.value.resetFields();
  }
}

function handleAdd(index: number) {
  languagePracticeList.value[index].isAdded = true;
}

function handleAddAll() {
  if (answers.value === 0){
    message.error('请先生成题目！')
  }else {
    isAddAll.value = true;
    //先延迟500ms，
    setTimeout(() => {
      message.success('一键入库成功！')
      isAddAll.value = false;
    }, 1000);
  }
}
</script>

<style scoped>
.full-screen-layout {
  height: 85vh;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen-height {
  height: 95%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
}

.half-screen {
  width: 100%;
  height: 100%;
}

.full-height {
  height: 75vh;
}

.full-height-right {
  height: 75vh; /* 设置固定高度 */
  overflow-y: scroll; /* 当内容超出时显示垂直滚动条 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding-bottom: 7px;
  border-bottom: 1px solid #e8eaec;
}

.card-header span {
  font-size: 16px;
  color: #909399;
}

.card-content {
  padding: 1rem;
}

.el-card-frame {
  margin-bottom: 1rem;
}

.center-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem; /* 可以根据需要调整间距 */
}

.input-num-left-align .el-input__inner {
  text-align: left !important;
}

.question {
  display: inline-block;
  background-color: rgb(251, 98, 96);
  color: white;
  margin-right: 10px;
//padding: 4px 8px; border-radius: 10px; width: 32px; /* 例如：8px * 4 */ height: 32px; /* 同上 */ line-height: 32px; /* 文本垂直居中 */ text-align: center; /* 文本水平居中 */
}

.answer {
  display: inline-block;
  background-color: rgb(129, 211, 248);
  color: white;
  margin-right: 10px;

//padding: 4px 8px; border-radius: 10px; width: 32px; /* 例如：8px * 4 */ height: 32px; /* 同上 */ line-height: 32px; /* 文本垂直居中 */ text-align: center; /* 文本水平居中 */
}

.key-info {
  color: rgb(129, 211, 248);
  font-size: 14px; /* 字号稍微小一点 */

}

.add-style {
  background-color: white;
  color: rgb(129, 211, 248);
  border: 1px solid rgb(129, 211, 248);
  padding-left: 28px; /* 为图标预留空间 */
}

.add-style:before {
  content: "+";
  display: inline-block;
  position: absolute;
  left: 10px; /* 根据需要调整位置 */
  color: rgb(129, 211, 248);
}

.button-container {
  position: absolute;
  bottom: 0; /* 距离底部的距离 */
  right: 0; /* 距离右边的距离 */
  margin: 2px; /* 边距可以根据需要调整 */
}

.light-text {
  color: #999; /* 浅灰色 */
  font-size: 14px; /* 字号稍微小一点 */
}

.el-row-style {
  margin-bottom: 10px;
}

.center-button2 {
  display: flex;
  align-items: center; /* 垂直居中 */
  height: 60px; /* 固定高度 */
}

.divider {
  height: 1px;
  background-color: #ccc;
  margin: 10px 0; /* 调整上下边距 */
}

.disabled {
  pointer-events: none;
  opacity: 0.7;
}

/* 如果需要对号图标的样式可以进一步定制 */
.success-icon {
  margin-right: 5px; /* 可以根据需要调整间距 */
  color: #67C23A; /* 绿色对号的颜色 */
  align-items: center; /* 文本和图标垂直居中 */
  font-weight: bold;
}

</style>
