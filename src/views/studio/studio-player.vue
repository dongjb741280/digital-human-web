<!-- 课程直播-->
<script lang="ts" setup>
import 'video.js/dist/video-js.css'
import {VideoPlayer} from '@videojs-player/vue'
import * as VideoCardApi from "@/api/h5/live";
import dayjs from 'dayjs';

const emit = defineEmits(['updatePlayingId'])

const player = shallowRef()
const loading = ref(false)

// 定义props接收父组件传递的视频信息
// 修改props定义
const props = defineProps({
  videoInfo: {
    type: Object,
    default: () => ({})
  },
  lessonId: {
    type: String,
    default: ''
  }
})

// 使用计算属性来跟踪props的变化
// 将computed改为ref，并设置初始值
const videoInfo = ref({
  ...props.videoInfo
})

// 添加watch来监听props变化
watch(() => props.videoInfo, (newVal) => {
  if (newVal) {
    videoInfo.value = {
      ...videoInfo.value,
      ...newVal
    }
  }
}, { deep: true })

// 根据lessonId获取视频信息
const getVideoByLessonId = async (lessonId) => {
  loading.value = true
  try {
    const videoParams = {
      "trainId": lessonId, //课程主键ID
    };
    const resData = await VideoCardApi.getTrainStream(videoParams);
    if (resData && resData.date) {
      let videoUrlNew = resData.date.videoUrl;
      if(videoUrlNew.startsWith("http://10.188.230.39:19001")){
          videoUrlNew = videoUrlNew.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio");
      }else if(videoUrlNew.startsWith("http://10.188.230.39:38080")){
          videoUrlNew = videoUrlNew.replaceAll("http://10.188.230.39:38080", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/live");
      }
      
      videoInfo.value = {
        videoTitle: resData.date.trainName,
        titleType: resData.date.liveType,
        videoCover: resData.date.liveCover.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio"),
        videoUrl: videoUrlNew,
        liveTime: resData.date.liveTime,
        liveState: '1',
        videoDesc: resData.date.liveDesc,
        froToEndTime: dayjs(resData.date.startTime).format('YYYY-MM-DD HH:mm')
      };
    }
  } catch (error) {
    console.error('获取视频信息失败', error);
  } finally {
    loading.value = false
  }
}

// 检查URL中是否有lessonId参数
// 修改onMounted钩子
onMounted(() => {
  if (props.lessonId) {
    getVideoByLessonId(props.lessonId);
  }
})

// 修改handleMounted函数
const handleMounted = (payload) => {
  if (props.lessonId) {
    getVideoByLessonId(props.lessonId, payload);
  }
  console.log('Basic player mounted', payload)
}

// http://88.212.7.11/live/test_desire_hd_hevc/playli
const options = ref({
    // 移除 height: '300vh' 设置
    type: 'm3u8',
    muted: false,
    autoplay: false,
    loop: false,
    volume: 0.6,
    preload: 'auto',
    objectFit: 'cover',
    currentTime: 0,
    showCurrentTime: false,
    errorText: '播放出错',
    controls: true,
    playsinline: true,
    preferFullWindow: true
})

const handleEvent = (log) => {
  // console.log('Basic player event', log)
  if(log && log.type === 'play') {
    handleVideoPlay() // 播放时调用handleVideoPlay
  } else if(log && (log.type === 'pause' || log.type === 'ended')) {
    handleVideoStop() // 暂停或结束时调用handleVideoStop
  }
}

const currentPlayingId = ref('')

const handleVideoPlay = () => {
  if( props.videoInfo?.id){
    currentPlayingId.value = props.videoInfo.id
    emit('updatePlayingId', currentPlayingId.value)
  }
}

const handleVideoStop = () => {
  currentPlayingId.value = ''
  emit('updatePlayingId', currentPlayingId.value)
}
</script>
<!-- :playback-rates="[0.7, 1.0, 1.5, 2.0]"         -->

<template>
  <div class="w-full h-full page_container" v-loading="loading">
    <!-- 标题和时间区域 -->
    <div class="header-info">
      <div class="title-wrapper">
        <span class="video-title">{{ videoInfo?.videoTitle }}</span>
        <div class="live-tag" v-if="videoInfo?.liveState == '2'">
          <span style="color: #ffffff;">直播中</span>
        </div>
      </div>
      <div class="time-wrapper">
        <span class="video-time">{{ videoInfo?.froToEndTime }}</span>
        <span class="live-num" v-if="videoInfo?.liveState == '2'"></span>
      </div>
    </div>

    <!-- 视频播放区域 -->
    <div class="video-container">
      <VideoPlayer
        :src="videoInfo?.videoUrl" 
        :poster="videoInfo?.videoCover"
        class="video-player vjs-big-play-centered w-full"
        crossorigin="anonymous"
        :options="options"      
        @mounted="handleMounted"
        @ready="handleEvent($event)"
        @play="handleEvent($event)"
        @pause="handleEvent($event)"
        @ended="handleEvent($event)"
        @loadeddata="handleEvent($event)"
        @waiting="handleEvent($event)"
        @playing="handleEvent($event)"
        @canplay="handleEvent($event)"
        @canplaythrough="handleEvent($event)"
        @timeupdate="handleEvent(player?.currentTime())"
      />
    </div>

    <!-- 简介区域 -->
    <div class="description-container">
      <span class="content-label">简介</span>
      <span class="content-text">{{ videoInfo?.videoDesc }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page_container {
  height: 100%;
  overflow-y: hidden;  /* 移除滚动条 */
  display: flex;
  flex-direction: column;
}

.header-info {
  padding: 10px 15px;
  background: #fff;
}

.title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.video-title {
  font-size: 20px;  /* 调大标题字体 */
  font-weight: 600;
  line-height: 1.5;
  flex: 1;
  margin-right: 10px;
}

.video-container {
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

.description-container {
  padding: 15px;
  background: #fff;
  flex: 0 0 auto;  /* 不允许压缩，但允许占据剩余空间 */
  height: 150px;   /* 固定高度 */
  overflow-y: auto;
  border-top: 1px solid #eee;
}

.time-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-container {
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

:deep(.video-player) {
  width: 100% !important;
  height: 100% !important;
  flex: 1;
}

:deep(.video-js) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.vjs-tech) {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

.description-container {
  padding: 10px 15px;
  background: #fff;
  margin-top: 10px;
  max-height: 120px;
  overflow-y: auto;
}

.live-tag {
  border-radius: 20px;
  background-color: brown;
  font-size: 12px;
  padding: 2px 10px;
}

.live-num {
  color: brown;
  font-size: 11px;
}

.video-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  flex: 1;
  margin-right: 10px;
}

.video-time {
  font-size: 13px;
  line-height: 1.5;
  color: #716d6d;
}

.content-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.content-text {
  display: block;
  font-size: 13px;
  line-height: 1.6;
  color: #666;
}
</style>
