<template>
  <div class="wh-full">
    <div class="flex gap-6">
      <div class="flex-1 border border-solid border-coolgray-100 rounded-2 shadow-sm px-20px">
        <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
          <el-form-item label="形象名称:" prop="humanName">
            <el-input v-model="formData.humanName" placeholder="请输入形象名称" />
          </el-form-item>
          <el-form-item label="上传训练视频:" prop="file">
            <el-upload
              ref="uploadRef"
              action=""
              :limit="1"
              :file-list="formData.file"
              :auto-upload="false"
              :show-file-list="true"
              class="upload-demo custom-upload-wrapper"
              :before-upload="beforeUpload"
              :custom-request="handleCustomUpload"
              :on-change="handleChange"
              :on-exceed="handleExceed"
            >
              <div
                class="custom-upload-button p-20px"
                @mouseover="isHovered = true"
                @mouseleave="isHovered = false"
              >
                <img
                  :src="isHovered ? blueCloud : whiteCloud"
                  alt="上传云朵图标"
                  class="cloud-img w-35% h-35%"
                />
                <div class="upload-text">
                  <div class="inline-text">
                    <p class="first-line">将文件拖到此处或点击上传</p>
                    <!-- <p class="second-line"><span>点击上传</span></p> -->
                  </div>
                  <p class="third-line">
                    上传的视频将用于数字人定制，系统将自动检测是否为有效视频，检测通过后才能正常进入训练，时长3-10分钟，分辨率需≥1080P（4k最佳）且宽高比应为16:9/9:16，支持MP4/MOV格式视频</p
                  >
                </div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="背景替换:" prop="humanBg">
            <el-radio-group v-model="formData.humanBg" :disabled="!isNew">
              <el-radio label="0">保留拍摄背景</el-radio>
              <el-radio label="1">去除拍摄背景</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="加入公共库:" prop="humanShare">
            <el-radio-group v-model="formData.humanShare">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex-1 border border-solid border-coolgray-100 rounded-2 shadow-sm px-20px">
        <div class="text-size-14px text-#333333 pt-10px">
          <p> 示例视频： </p>
        </div>
        <div class="video-container">
          <VideoPlayer
            @mounted="handleMounted"
            @waiting="handleEvent"
            class="video-player vjs-big-play-centered w-150px h-100px"
            crossorigin="anonymous"
            :volume="0.6"
            :width="150"
            :sources="[
              {
                src: videoUrl,
                type: 'video/mp4'
              }
            ]"
            :playback-rates="[0.7, 1.0, 1.5, 2.0]"
            :autoplay="false"
            controls
            :controlBar="{
              children: [
                { name: 'PlayToggle' },
                { name: 'volumePanel' },
                { name: 'progressControl' }
              ],
              PictureInPictureToggle: false,
              FullscreenToggle: true
            }"
          />
        </div>
        <div class="text-size-14px text-#333333">
          <p> 视频说明: </p>
          <ul class="text-#999999 text-size-13px">
            <li>训练视频应保持在4到5分钟之间，并采用MP4或MOV格式进行上传。</li>
            <li>视频分辨率应为1080P(4K最佳)，宽高比应为16:9/9:16，支持MP4/MOV格式视频。</li>
            <li>
              视频时长和参数方面：视频分辨率为1080p，帧率建议为25fps，码率应在20000kbps以上，使用H.264编码进行压缩。
            </li>
            <li>
              拍摄环境方面：确保拍摄时光线充足但不过曝，周围安静无噪音。如果需要更换背景，避免剪辑。内容应包括口型和动作表现，表演面部和颈部无抖动，动作应通用且幅度适中。
            </li>
            <li>
              人物要求方面：确保人物全程处于光线下充足的环境中，服装整洁且饰品不会动，面部应朝向正面，角度适中，发音要清晰，嘴形饱满。
            </li>
            <li>
              声音要求：视频中的声音应清晰可听，背景噪音要尽可能小。尽量避免人声重叠或其他不需要的噪音。
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex mt-20px w-full flex-col justify-center items-center">
      <div>
        <!-- <el-button @click="cancelAction">取消</el-button> -->
        <el-button
          type="primary"
          :disabled="isMakingVideo"
          :loading="isLoading"
          @click="makeVideoAction"
          >立即制作
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'video.js/dist/video-js.css'
import { VideoPlayer } from '@videojs-player/vue'
import whiteCloud from '@/assets/imgs/ai/whitecloud.png'
import blueCloud from '@/assets/imgs/ai/bluecloud.png'
import * as DigitalPersonApi from '@/api/ai/digitalPerson'
import { DigitalPersonVO, videoUpload } from '@/api/ai/digitalPerson'

import { ElMessage } from 'element-plus'
import { shallowRef } from 'vue'
import axios from 'axios'

const handleExceed = (files, fileList) => {
  ElMessage.warning(`只能上传一个文件，当前已选择 ${files.length} 个文件`)
}
const formRef = ref() // 表单 Ref
const { t } = useI18n() // 国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const message = useMessage() // 消息弹窗
const uploadedFiles = ref([])
const uploadRef = ref(null) // 创建一个ref来引用el-upload组件
const route = useRoute()
const isNew = ref(route.query.isNew === 'true')
const videoUrl = ref(
  import.meta.env.VITE_BASE_URL + '/digital-api/system/aiDhHuman/getExampleVideo'
)
const uploadApiEndpoint = ref(
  import.meta.env.VITE_BASE_URL + '/digital-api/system/aiDhHuman/uploadViedo'
)
const isMakingVideo = ref(false)
const isLoading = ref(false)
const router = useRouter()
const loadExistingData = async () => {
  // 如果是修改，则从后端获取数据
  if (!isNew.value) {
    const id = route.query.id as string
    const response = await DigitalPersonApi.getOne(id)
    console.log('response', response)
    formData.value = response
  }
}

onBeforeMount(() => {
  // 如果是修改，则加载现有数据
  if (!isNew.value) {
    loadExistingData()
  }
})

const player = shallowRef(null)

const handleMounted = (payload) => {
  player.value = payload.player
  // player.value.type = 'application/x-mpegURL';
  player.value.autoplay()
  // getVideoIO({ id: porps.data.id }).then(resp => {
  //   console.log(resp);
  // })
}

const handleEvent = (payload) => {
  console.log('handleEvent', payload)
}

const startUpload = async () => {
  // 确保有文件被选中
  if (formData.value.file.length) {
    // 调用上传组件的submit方法
    const data = formData.value.file[0]
    //const formData2 = formData.value as unknown as DigitalPersonVO
    // 创建一个新对象，用于传递给后端
    const formData2 = { humanName: formData.value.humanName } as unknown as DigitalPersonVO
    // 从新对象中移除 'file' 键及其对应的值
    console.log('jinlailema', data)
    //从formData2移除file
    // 移除'file'键及其对应的值
    const uploadResult = await videoUpload(data, formData2)
    if (uploadResult.code === 0 && uploadResult.data.humanViedoUrl) {
      // 将获取到的fileId存入formData
      formData.value.fileId = uploadResult.data.humanViedoUrl
      formData.value.id = uploadResult.data.id
      console.log('File ID 已保存至 formData:', formData.value.fileId)
      // 显示成功消息
      message.success('上传成功！')
    } else {
      console.error('上传返回的数据中未找到 fileId')
      message.error('上传失败，请重试！')
    }
  } else {
    alert('请先选择文件！')
  }
}

interface FormData {
  id: string
  humanName: string
  humanBg: string
  file: File[]
  fileId: string
  humanShare: string
}

const isHovered = ref(false)

const formData = ref<FormData>({
  id: '',
  humanName: '',
  humanBg: '',
  file: [],
  fileId: '',
  humanShare: ''
})

const playerOptions = ref({
  sources: [
    {
      src: 'https://vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4'
    }
  ],
  poster: 'https://vjs.zencdn.net/v/oceans.png', // 可选，视频封面图
  controls: true, // 显示播放控件
  autoplay: false, // 是否自动播放
  preload: 'auto', // 预加载策略
  fluid: true // 让播放器自适应容器宽度
})

const rules = {
  humanName: [{ required: true, message: '形象名称为必填项', trigger: 'blur' }],
  upload: [{ required: true, message: '上传训练视频为必填项', trigger: 'blur' }],
  humanBg: [{ required: true, message: '请选择背景替换选项', trigger: 'change' }],
  file: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value && value.length === 0) {
          callback(new Error('上传训练视频为必填项'))
        } else {
          callback()
        }
      },
      trigger: 'change' // 触发验证的时机，这里是在文件列表发生变化时触发
    }
  ],
  humanShare: [{ required: true, message: '请选择是否加入公共库选项', trigger: 'change' }]
}

const file = ref<File | null>(null)
const uploadUrl = ref('')

const validateName = (rule: any, value: string): string | boolean => {
  if (!value) {
    return '形象名称为必填项'
  }
  return true
}

const validateFile = (rule: any, value: File | null): string | boolean => {
  if (!value) {
    return '上传训练视频为必填项'
  }
  return true
}

const beforeUpload = (file: File): boolean => {
  alert('请先填写完整信息')
  return false
}

const handleCustomUpload = (file: File) => {
  console.log('handleCustomUpload called', file)
  //formData.value.upload = file; // 直接将选中的文件赋值给formData.upload
  // 这里还可以添加其他逻辑，比如预览、校验文件等
}

const cancelAction = () => {
  console.log('Cancel button clicked')
}

// 处理文件改变时的逻辑，例如在用户选择新文件时更新列表
const handleChange = (file, fileList) => {
  console.log('onChange called', file)
  if (file.status === 'ready') {
    // 这里可以添加逻辑来处理文件变化，比如预览、验证等
    // 注意，此示例直接使用了传入的fileList，实际中可能需要根据业务逻辑处理
    uploadedFiles.value = fileList
    formData.value.file = fileList
    startUpload()
  }
}

const onProgress = (event, file, fileList) => {
  console.log('上传进度:', event.percent)
  // 更新进度条或其他UI元素
}

const makeVideoAction = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    isMakingVideo.value = false
    isLoading.value = true
    // 如果需要将voiceSex转换为字符串（尽管通常这不是必要的）
    /*if (formData.value.file && formData.value.file.length !== 0) {
      formData.value.file = formData.value.file[0].raw
    }*/
    //获取formData里的uploadFiles
    //const data = formData.value as unknown as DigitalPersonVO
    const data2 = {
      id: formData.value.id,
      humanName: formData.value.humanName,
      humanBg: formData.value.humanBg,
      fileId: formData.value.fileId,
      humanShare: formData.value.humanShare
    } as unknown as DigitalPersonVO
    if (isNew.value) {
      const result = await DigitalPersonApi.create(data2)
      console.log('result', result)
      if (result) {
        message.success(t('common.createSuccess'))
        //alert('提交成功！')
      }
    } else {
      const result = await DigitalPersonApi.update(data2)
      if (result) {
        message.success(t('common.updateSuccess'))
        //alert('提交成功！')
      }
    }
    // 调用成功后，跳转到列表页面
    router.push('/digital/digitalPersonManage') // 假设'/voice-list'是列表页面的路径
  } finally {
    formLoading.value = false
    isMakingVideo.value = true
    isLoading.value = false
    formRef.value.resetFields()
    // 重置 formData 到初始状态
    formData.value.id = ''
    formData.value.humanShare = ''
    formData.value.humanBg = ''
    formData.value.humanName = ''
    formData.value.file = []
    formData.value.fileId = ''
  }
}

const makeVideoAction2 = () => {
  console.log('Make video button clicked')
}
</script>

<style scoped lang="scss">
.video-container {
  position: relative;
  display: flex; /* 使用Flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 0; /* 重要：使用padding-bottom来维持宽高比 */
  padding-bottom: 56.25%; /* 对于16:9的宽高比 */
  overflow: hidden;
}

.video-js {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; /* 四个方位都设为0，使VideoPlayer充满整个容器 */
  width: 100% !important; /* 强制覆盖其他可能的宽度设置 */
  height: 100% !important; /* 同上，强制高度充满 */
  object-fit: cover; /* 保持视频的宽高比并填充容器 */
}

.custom-upload-wrapper {
  position: relative;
}

.custom-upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; /* 内容垂直居中并排布成一列 */
  gap: 10px; /* 子元素间的间距 */
  width: 100%; /* 宽度为100%，这样会根据父容器自动伸缩 */
  max-width: 100%; /* 确保宽度不超过父容器 */
  height: 40%; /* 高度保持不变，或者也可以设置为百分比 */
  border-radius: 10px;
  background-color: #f2f2f2;
  border: 2px dashed transparent; /* 初始状态下边框为透明 */
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.custom-upload-button:hover {
  background-color: white;
  border-color: #b3d4fc; /* 更明显的边框颜色 */
}

.cloud-icon path {
  fill: #999; /* 默认云朵颜色 */
  transition: fill 0.3s ease;
}

.cloud-icon.hover path:not(.blue-path),
.cloud-icon:hover path:not(.blue-path) {
  fill: transparent; /* 鼠标悬停时隐藏灰色云朵 */
}

.cloud-icon .blue-path {
  fill: transparent; /* 默认隐藏蓝色云朵 */
}

.cloud-icon:hover .blue-path {
  fill: #007bff; /* 鼠标悬停时显示蓝色云朵 */
}

.upload-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-left: 0px; /* 适当调整距离 */
}

.inline-text {
  display: flex; /* 使用Flex布局让文本在同一行显示 */
  gap: 5px; /* 在两段文本间添加间距 */
}

.first-line,
.third-line {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.second-line .highlight {
  color: #007bff;
}

.light-text li {
  color: #999; /* 浅灰色，可以根据需要调整颜色 */
}

.el-form-item:first-child {
  margin-top: 1rem; /* 设置上边距为1rem */
}

.video-description:first-of-type {
  margin-top: 1rem; /* 为首个.video-description元素添加上边距 */
}

:deep(.vjs-poster) {
  background-color: #fff !important;
}

:deep(.vjs-tech) {
  background-color: #fff !important;
}
</style>
