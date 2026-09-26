<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" :width="1200" :close-on-click-modal="false" @close="closeDialog">
    <el-steps :active="activeStep" finish-status="success" class="pb-8">
      <el-step title="基本信息"></el-step>
      <el-step title="内容编辑"></el-step>
    </el-steps>

    <el-form v-if="activeStep === 0" ref="formRef" :model="formData" :rules="formRules" label-width="100px"
      v-loading="formLoading">
      <el-form-item label="直播名称" prop="liveName">
        <el-input v-model="formData.liveName" placeholder="请输入直播名称" />
      </el-form-item>
      <el-form-item label="直播时间" prop="liveTime">
        <el-date-picker v-model="formData.liveTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择直播时间" />
      </el-form-item>
      <el-form-item label="直播分类" prop="liveType">
        <el-select v-model="formData.liveType" placeholder="请选择直播分类">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.LIVE_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="系统归属" prop="systemType">
        <el-select v-model="formData.systemType" placeholder="请选择系统归属">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="地市归属" prop="eparchyCode">
        <el-select v-model="formData.eparchyCode" placeholder="请选择地市归属">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.EPARCHY_CODE)" :key="dict.value" :label="dict.label"
                     :value="dict.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="直播封面" prop="liveCover">
        <el-upload class="avatar-uploader" accept="image/*" :auto-upload="false" 
          :show-file-list="true"
          :before-upload="beforeAvatarUpload" 
          :file-list="coverFileList"
          :on-change="(file) => uploadData.append('phoneFIle', file.raw as Blob)">
          <img v-if="formData.liveCover" :src="formData.liveCover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
          <template #tip>
            <div class="！el-upload__tip text-red">
              只限1个文件 ，且不超过2MB, 图片格式为JPG
            </div>
          </template>
</el-upload>
</el-form-item> -->
      <el-form-item label="直播简介" prop="liveDesc">
        <el-input v-model="formData.liveDesc" placeholder="请输入直播简介" type="textarea" :rows="4" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="上传PPT" prop="copywriteId">
        <el-upload action="none" accept=".pptx, .ppt" class="custom-upload" :limit="1" :auto-upload="false"
          :show-file-list="true" :file-list="pptFileList"
          :on-change="(file) => uploadData.append('pptFIle', file.raw as Blob)">
          <template #trigger>
            <el-button type="primary" size="small">上传PPT</el-button>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <div v-if="activeStep === 1">
      <VideoProd ref="videoProd" :soureType="2" :pptInfo="pptInfo"></VideoProd>
    </div>

    <Results ref="resultsRef"></Results>

    <template #footer>
      <el-button type="primary" @click="submitForm"
        v-if="formType === 'create' && activeStep < 1 && formLoading === false">下一步</el-button>
      <el-button type="primary" @click="activeStep++" v-else-if="activeStep < 1">下一步</el-button>
      <el-button type="success" @click="commitLiveVideo" v-if="activeStep === 1">提交</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { AiLiveMainApi, AiLiveMainVO } from '@/api/digital/live'
import VideoProd from '@/views/digital/video-prod.vue'
import Results from './Results.vue'

import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const pptInfo = ref({})

/** 数字人直播管理主 表单 */
defineOptions({ name: 'AiLiveMainForm' })


const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  liveName: undefined,
  liveTime: undefined,
  liveType: undefined,
  systemType: undefined,
  liveCover: undefined,
  liveDesc: undefined,
  copywriteId: undefined,
  eparchyCode: undefined
})
const formRules = reactive({
  liveName: [{ required: true, message: '直播名称不能为空', trigger: 'blur' }],
  liveTime: [{ required: true, message: '直播时间不能为空', trigger: 'blur' }],
  liveType: [{ required: true, message: '直播分类不能为空', trigger: 'change' }],
  systemType: [{ required: true, message: '系统归属不能为空', trigger: 'change' }],
  eparchyCode: [{ required: true, message: '地市归属不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref
const videoProd = ref()
const activeStep = ref(0) // 当前激活的步骤：0-基本信息；1-其他信息
const resultsRef = ref() // 添加 Results 组件的引用

const completedFlag = ref(false) // 是否完成

const coverFileList = ref([]) // 添加文件列表状态
const pptFileList = ref([]) // 添加文件列表状态

let mainId = ''

const uploadData = new FormData()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AiLiveMainApi.getAiLiveMain(id)
      mainId = String(id)  // 将 id 转换为字符串

    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const getpptInfo = val =>{
  pptInfo.value = val
}
/** 提交表单 */
//const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  // formLoading.value = true
  // 显示结果对话框
  resultsRef.value?.show(1)
  try {
    const data = formData.value as unknown as AiLiveMainVO
    uploadData.append('liveId', '1111')
    uploadData.append('liveName', data.liveName)
    uploadData.append('liveTime', data.liveTime)
    uploadData.append('liveType', data.liveType)
    uploadData.append('systemType', data.systemType)
    uploadData.append('liveCover', data.liveCover)
    uploadData.append('liveDesc', data.liveDesc)
    uploadData.append('copywriteId', data.copywriteId)
    uploadData.append('eparchyCode', data.eparchyCode)

    if (formType.value === 'create') {
      const result = await AiLiveMainApi.createAiLiveMain(uploadData)
      resultsRef.value?.success()
      if (result) {
        // 制作成功
        ElMessage.success('制作成功')
        // 创建对象并调用 getpptInfo 方法
        const pptInfoObj = {
          liveId: result.data.liveId,
          pptId: result.data.pptId,
          copyrightId: result.data.mainPPtId
        }
        getpptInfo(pptInfoObj)
      }
      mainId = result.data.liveId
      message.success(t('文案制作完成'))
    } else {
      // await AiLiveMainApi.updateAiLiveMain(data)
      // message.success(t('common.updateSuccess'))
    }

    if (activeStep.value < 1) {
      activeStep.value++
    }
  } catch (error) {
    // 处理错误
    resultsRef.value?.fail()
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    liveName: undefined,
    liveTime: undefined,
    liveType: undefined,
    systemType: undefined,
    liveCover: undefined,
    liveDesc: undefined,
    copywriteId: undefined,
    eparchyCode: undefined
  }
  pptFileList.value = []
  activeStep.value = 0
  formRef.value?.resetFields()
}

/** 重置表单 */
const commitLiveVideo = () => {
  videoProd.value.commitLiveVideo(mainId);
  completedFlag.value = true
  activeStep.value = 0
  dialogVisible.value = false
  console.log('视频生成')
  emit('success')
  
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const closeDialog = async () => {
  if (mainId && !completedFlag.value) {
    await AiLiveMainApi.deleteAiLiveMain(Number(mainId))
  }
  console.log('关闭弹窗')
  dialogVisible.value = false
  resetForm()
}

onMounted(() => {
  activeStep.value = 0
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.custom-upload .el-upload-list {
  margin-top: 10px;
  border: 1px #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  width: 300px;
}

.custom-upload .el-upload-list__item {
  color: #333;
  font-size: 14px;
}

.custom-upload .el-upload-list__item:hover {
  background-color: #e6f7ff;
}
</style>
