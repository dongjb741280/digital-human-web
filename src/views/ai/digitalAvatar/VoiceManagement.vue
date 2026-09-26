<template>
  <div class="page">
    <!-- 第一个包裹元素，带有边框 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-tabs v-model="activeTab" class="tab-align-left">
          <el-tab-pane label="声音管理" name="my-clones"/>
        </el-tabs>
      </el-col>
      <el-col :span="8" style="text-align: right;">
        <el-button type="primary" @click="navigateToTargetPage">立即制作</el-button>
      </el-col>
    </el-row>
    <!-- 添加间隔 -->
    <div class="first-row-gap"></div>
    <!-- 第二个包裹元素，也带有边框 -->
    <el-row type="flex" justify="start" :gutter="20">
      <el-radio-group v-model="radioValue">
        <el-radio value="0" border>我的克隆</el-radio>
        <el-radio value="1" border>公共库</el-radio>
      </el-radio-group>
    </el-row>
    <!-- 添加一个带有间隔样式的div -->
    <div class="row-gap"></div>
    <el-row v-if="radioValue === '0'" :gutter="20">
      <voice-container
        :pagination="true"
        :voiceShare="0"
        :more="true"
        showSearch
        class="w-full"
      />
    </el-row>
    <el-row v-if="radioValue === '1'" :gutter="20">
      <voice-container
        :pagination="true"
        :voiceShare="1"
        :more="true"
        showSearch
        class="w-full"
      />
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'; // 引入ref以创建响应式数据
import {useRouter} from 'vue-router';
import * as VoiceApi from '@/api/ai/voice';
import {VoiceVO} from "@/api/ai/voice";
import VoiceContainer from "@/views/digital/components/voice/VoiceContainer.vue";
const message = useMessage() // 消息弹窗

defineOptions({ name: 'VoiceManagement' })


/** 初始化 **/
onMounted(async () => {
  //await getVoicePage()
  //await getPublicPage()
})

const refreshVoiceList = async () => {
  await getVoicePage()
  await getPublicPage()
}


const router = useRouter();
const activeTab = ref('my-clones')
const radioValue = ref('0') // 草稿/成品/我的视频/公共
const loading = ref(true) // 列表的加载中
const voiceList = ref<VoiceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const publicList = ref<VoiceVO[]>([]) // 列表的数据
const publicTotal = ref(0) // 列表的总页数


const queryParams = reactive({
  pageNo: 1,
  pageSize: 999,
  voiceShare: "0"
})

const publicParams = reactive({
  pageNo: 1,
  pageSize: 999,
  voiceShare: "1"
})
/** 查询列表 */
const getVoicePage = async () => {
  loading.value = true
  try {
    const data = await VoiceApi.getVoicePage(queryParams)
    voiceList.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const getPublicPage = async () => {
  loading.value = true
  try {
    const data = await VoiceApi.getVoicePage(publicParams)
    publicList.value = data.data
    publicTotal.value = data.total
  } finally {
    loading.value = false
  }
}

const navigateToTargetPage = () => {
  router.push('/digital/createVoice');
};

const onItemClick = (item: any) => {

}

const selectedTab = ref('my-clones'); // 使用ref定义selectedTab

// 定义父组件中的方法
const handleCreate = () => {
  console.log('创作按钮点击事件处理');
  // 这里写你的处理逻辑
};
</script>

<style lang="scss" scoped>
.className {
  width: 260px !important;
}

.page {
  margin-left: 10px;
}

.first-row-gap{
  height: 1px;
}

.row-gap {
  height: 20px; /* 设置高度为20px以创建间隔 */
}

.custom-margin {
  margin-right: 40px;
}

.text-align-left {
  text-align: left;
}

.centered-names {
  text-align: center; /* 文本水平居中 */
  /* 如果需要垂直居中，且知道容器高度，可以使用以下方法：
  display: flex;
  justify-content: center;
  align-items: center;
  height: 您的容器高度; */
}

.el-card {
  display: flex; /* 启用Flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 确保卡片内容区域撑满高度，以便垂直居中生效 */
}

.avatar {
  width: 230px; /* 指定宽度 */
  height: 320px; /* 指定高度 */
  object-fit: cover; /* 保持图片不失真并填充容器 */
  max-width: 100%; /* 限制图片最大宽度为卡片内容区宽度，保持响应式 */
}

:deep(.el-radio__inner) {
  display: none;
}

[v-cloak] {
  display: none !important;
}

.voiceClassName {
  margin-bottom: 15px;
}

.row-gap {
  height: 20px;
}

.row-wrapper {
  border: 1px solid #ccc; /* 示例边框颜色为灰色，您可以按需调整 */
  box-sizing: border-box; /* 包含边框和内边距的宽度计算 */
  padding: 20px; /* 可选，增加内部间距 */
  margin-bottom: 20px; /* 可选，底部外边距，增加间隔 */
  border-radius: 10px; /* 添加圆角，数值可以根据需要调整 */

}
</style>
