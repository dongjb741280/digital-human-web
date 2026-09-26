<template>
  <div class="w-full">
    <div class="flex gap-6">
      <div class="flex-1 border border-solid border-coolgray-100 rounded-2 shadow-sm px-20px">
        <el-form
          ref="formRef"
          :model="formData"
          label-width="110px"
          :rules="rules">
          <el-form-item label="声音名称:" prop="voiceName">
            <el-input v-model="formData.voiceName" placeholder="请输入声音名称"/>
          </el-form-item>
          <el-form-item label="上传训练音频:" prop="uploadFiles">
            <el-upload
              ref="uploadRef"
              action=""
              :limit="1"
              :file-list="formData.uploadFiles"
              :auto-upload="false"
              :show-file-list="true"
              class="upload-demo  custom-upload-wrapper "
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
                    <!-- <p class="second-line"><span class="highlight">点击上传</span></p> -->
                  </div>
                  <p class="third-line">上传的音频将用于数字人定制，格式为mp3、m4a、wav，音频时长：30秒～5分钟，文件小于20M</p>
                </div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="声音性别:" prop="voiceSex">
            <el-radio-group v-model="formData.voiceSex">
              <el-radio label="0">男性声音</el-radio>
              <el-radio label="1">女性声音</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="声音标签:" prop="voiceLabel">
            <el-input v-model="formData.voiceLabel" placeholder="请输入声音标签，多个以逗号隔开"/>
          </el-form-item>
        </el-form>
      </div>
      <div
        class="flex-1 border border-solid border-coolgray-100 rounded-2 shadow-sm px-20px ">
        <div class="text-size-14px text-#333333 pt-10px">
          <p>
            示例视频：
          </p>
        </div>
        <div class="video-container">
          <VideoPlayer
            @mounted="handleMounted"
            @waiting="handleEvent"
            class="video-player vjs-big-play-centered w-150px h-100px"
            crossorigin="anonymous"
            :volume="0.6"
            :width="150"
            :sources="[{
               src: videoUrl,
               type: 'video/mp4',
            }]"
            :playback-rates="[0.7, 1.0, 1.5, 2.0]"
            :autoplay="false"
            controls
            :controlBar="{ children: [{ name: 'PlayToggle' }, { name:'volumePanel'}, { name: 'progressControl' }],PictureInPictureToggle: false, FullscreenToggle: true }"/>
        </div>
        <div class="text-size-14px text-#333333">
          <p>
            音频说明：
          </p>
          <ul class="text-#999999 text-size-13px">
            <li>录音准备方面：请准备约5000字左右的文本内容作为录音素材，确保文本内容与应用场景语境相符，以便更准确地模拟目标声音。</li>
            <li>录音环境方面：录音环境应保持安静，底噪应小于40dB，以避免对录音质量产生干扰。在录制时，确保无回音、无混响、无噪声，以保证录音的纯净度。</li>
            <li>
              录音设备及参数方面：推荐使用降噪麦克风或小蜜蜂进行录音，以获得更好的音质。同时，建议使用48kHz采样率进行录制，以确保音频的清晰度和保真度。录音格式推荐使用wav、fiv、m4a等无损音质格式，以便更好地保留音频的原始信息。
            </li>
            <li>
              录音人表现方面：发音应清晰、吐字清楚，以确保录音的可辨识度。在录音时，句与句之间应保持适当的断句和停顿，通常为1至2秒，以便系统更好地识别和处理语音数据。同时，应保持语境风格的一致性，避免多种情绪混杂，以提高声音克隆的准确性和自然度。
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
          @click="makeVideoAction">立即制作
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import 'video.js/dist/video-js.css';
import {VideoPlayer} from '@videojs-player/vue';
import whiteCloud from '@/assets/imgs/ai/whitecloud.png';
import blueCloud from '@/assets/imgs/ai/bluecloud.png';
import * as VoiceApi from '@/api/ai/voice';

const router = useRouter();
import {ElMessage} from 'element-plus';
import {voiceUpload} from "@/api/ai/voice";
import {shallowRef} from 'vue';

const handleExceed = (files, fileList) => {
  ElMessage.warning(`只能上传一个文件，当前已选择 ${files.length} 个文件`);
};
const formRef = ref() // 表单 Ref
const {t} = useI18n() // 国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const message = useMessage() // 消息弹窗
const uploadedFiles = ref([])
const uploadRef = ref(null); // 创建一个ref来引用el-upload组件
const videoUrl = ref(import.meta.env.VITE_BASE_URL + '/digital-api/system/aiDhHuman/getExampleVideo')
const isMakingVideo = ref(false);
const isLoading = ref(false);

const player = shallowRef(null);

const handleMounted = (payload) => {
  player.value = payload.player
  // player.value.type = 'application/x-mpegURL';
  player.value.autoplay();
  // getVideoIO({ id: porps.data.id }).then(resp => {
  //   console.log(resp);
  // })
}

const handleEvent = (payload) => {
  console.log('handleEvent', payload)
}

const startUpload = async () => {
  // 确保有文件被选中
  if (formData.value.uploadFiles.length) {
    // 调用上传组件的submit方法
    const data = formData.value.uploadFiles[0]
    console.log("jinlailema", data)
    const uploadResult = await voiceUpload(data)
    if (uploadResult.code === 0 && uploadResult.data.voiceOrgUrl) {
      // 将获取到的fileId存入formData
      formData.value.voiceOrgUrl = uploadResult.data.voiceOrgUrl;
      console.log("File ID 已保存至 formData:", formData.value.voiceOrgUrl);
      // 显示成功消息
      message.success('上传成功！');
    } else {
      console.error("上传返回的数据中未找到 voiceOrgUrl");
      message.error('上传失败，请重试！');
    }
  } else {
    alert('请先选择文件！');
  }
};

interface FormData {
  voiceName: string;
  voiceSex: string[];
  voiceLabel: string;
  uploadFiles: File[];
  voiceOrgUrl: string;
}

const isHovered = ref(false);

const formData = ref<FormData>({
  voiceName: '',
  voiceSex: [],
  voiceLabel: '',
  uploadFiles: [],
  voiceOrgUrl: '',
});

const rules = {
  voiceName: [{required: true, message: '形象名称为必填项', trigger: 'blur'}],
  voiceSex: [{required: true, message: '请选择背景替换选项', trigger: 'change'}],
  voiceLabel: [{required: true, message: '请输入声音标签，多个以逗号隔开', trigger: 'blur'}],
  uploadFiles: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('上传训练音频为必填项'));
        } else {
          callback();
        }
      },
      trigger: 'change', // 触发验证的时机，这里是在文件列表发生变化时触发
    },
  ],
};

const file = ref<File | null>(null);
const uploadUrl = ref('');

const validateName = (rule: any, value: string): string | boolean => {
  if (!value) {
    return '形象名称为必填项';
  }
  return true;
};

const validateFile = (rule: any, value: File | null): string | boolean => {
  if (!value) {
    return '上传训练视频为必填项';
  }
  return true;
};

const beforeUpload = (file: File): boolean => {
  alert("请先填写完整信息");
  return false;
};

const handleCustomUpload = (file: File) => {
  console.log("handleCustomUpload called", file);

  //formData.value.upload = file; // 直接将选中的文件赋值给formData.upload
  // 这里还可以添加其他逻辑，比如预览、校验文件等
};

const cancelAction = () => {
  console.log("Cancel button clicked");
};

// 处理文件改变时的逻辑，例如在用户选择新文件时更新列表
const handleChange = (file, fileList) => {
  console.log("onChange called", file)
  if (file.status === 'ready') {
    // 这里可以添加逻辑来处理文件变化，比如预览、验证等
    // 注意，此示例直接使用了传入的fileList，实际中可能需要根据业务逻辑处理
    uploadedFiles.value = fileList;
    formData.value.uploadFiles = fileList;
    startUpload();
  }
};

const makeVideoAction = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    isMakingVideo.value = false;
    isLoading.value = true;
    //获取formData里的uploadFiles
    const data = formData.value as unknown as VoiceApi.VoiceVO
    const result = await VoiceApi.voiceSave(data)
    if (result.data === 0) {
      message.success(t('common.createSuccess'))
      await router.push('/digital/voiceManagement');
    }
  } finally {
    formLoading.value = false
    isMakingVideo.value = true;
    isLoading.value = false;
    formRef.value.resetFields();
  }
}


const makeVideoAction2 = () => {
  console.log("Make video button clicked");
};
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
  transition: background-color 0.3s ease, border-color 0.3s ease;
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
