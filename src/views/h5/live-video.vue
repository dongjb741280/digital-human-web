<!-- 课程直播-->
<script lang="ts" setup>
import 'video.js/dist/video-js.css'
import {VideoPlayer} from '@videojs-player/vue'
import * as VideoCardApi from "@/api/h5/live";
import dayjs from 'dayjs';

// const router = useRouter()
const route = useRoute()
const player = shallowRef()
const videoInfo = ref(route.query);
const loading = ref(false)

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
onMounted(() => {
  if (route.query.lessonId) {
    getVideoByLessonId(route.query.lessonId);
  }
})

// http://88.212.7.11/live/test_desire_hd_hevc/playli
const options = ref({
    height: '300vh',  // 播放器高度，默认100vh
    // src: videoInfo.value.videoUrl,
    // src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
    // poster: videoInfo.value.videoCover, // 视频海报
    type: 'm3u8', // 视频类型
    muted: false, // 视频静音
    autoplay: false,  // 自动播放
    loop: false, // 循环播放
    volume: 0.6,  // 音量大小 0-1
    preload: 'auto',  // 预加载
    objectFit: 'cover', // 同css object-fit，作用于video标签
    currentTime: 0, // 当前播放时间
    showCurrentTime: false, // 是否在拖动进度条时toast当前时间文字
    errorText: '播放出错', // 视频error时，toast提示
    controls: true,
    playsinline: true,
    preferFullWindow: true, //将此设置为true将更改不支持 HTML5 全屏 API 但支持视频元素全屏的设备（即 iPhone）上的全屏行为。播放器将被拉伸以填充浏览器窗口，而不是全屏播放视频
})
  
const handleMounted = (payload) => {
  if (route.query.lessonId) {
    getVideoByLessonId(route.query.lessonId,payload);
  }
  // player.value = payload.player
  console.log('Basic player mounted', payload)
}

const handleEvent = (log) => {
  console.log('Basic player event', log)
}

</script>
<!-- :playback-rates="[0.7, 1.0, 1.5, 2.0]"         -->

<template>
  <div class="w-full h-full page_container" v-loading="loading">
    <VideoPlayer
      :src="videoInfo.videoUrl" 
      :poster="videoInfo.videoCover"
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
    <div>
        <div class="live-tag" v-if="videoInfo.liveState == '2'"><span style="color: #ffffff;">直播中</span></div>
        <div><span class="video-title">{{ videoInfo.videoTitle }}</span></div>
        <div v-if="videoInfo.liveState == '2'"><span class="live-num"></span></div>
        <div><span class="video-time">
          {{ videoInfo.froToEndTime }}
        </span></div>
    </div>
    <div>
      <span class="content-label">简介</span>
      <span class="content-text">{{ videoInfo.videoDesc }}</span>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.page_container{
  height: calc(100vh - 90px);
  overflow-y: scroll;
}

.live-tag {
  float: right;
  border-radius: 20px;
  background-color: #ff4d4f;
  font-size: 12px;
  padding: 2px 10px;
  margin-right: 5px;
  margin-top: 5px;
}

.live-num {
  float: right;
  color: #ff4d4f;
  font-size: 11px;
  margin-right: 10px;
  margin-top: 5px;
}


.content-label {
  margin-top: 20px;
  margin-left: 10px;
  display: block;
  font-size:1.3em;
  line-height: 1.5;
}

.content-text {
  display: block;
  text-indent:2em;
  line-height: 2;
  margin:10px;
}

.video-title {
  margin-top: 5px;
  margin-left: 10px;
  display:block;
  font-size:1.1em;
  line-height: 1.5;
}

.video-time {
  margin-top: 2px;
  margin-left: 10px;
  display:block;;
  font-size:0.8em;
  line-height: 1.5;
  color: #716d6d;
}



</style>