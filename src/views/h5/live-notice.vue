<!-- 课程直播-->
<script lang="tsx" setup>
import { VideoCard } from "./components";
import { encryptByKeyAndIv } from "@/utils/crypto";
import * as VideoCardApi from "@/api/h5/live";
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus'

/** 初始化 **/
onMounted(() => {
  getLiveNoticeInfo();
  getLiveVideoPage();
})


const router = useRouter()

const loading = ref(false)

const liveVideoPageList = ref([]);// 列表的数据
const liveVideoPageTotal = ref(0);// 列表的数据
const liveNoticeInfo = ref({});// 列表的数据
const videoInfo = ref({});// 列表的数据
const showMore = ref(true);// 列表的数据

const queryParams = reactive({
  pageNo: 1,
  pageSize: 5
})

/** 查询直播预告信息 */
const getLiveNoticeInfo = async () => {
  loading.value = true
  try {
    console.log('getLiveNoticeInfo queryParams', queryParams);
    const data = await VideoCardApi.getRecent();
    console.log('getLiveNoticeInfo data', data);
    if (data) {
      liveNoticeInfo.value = {
        liveId: data.id,
        videoTitle: data.liveName,
        titleType: data.liveType,
        videoCover: data.liveCover.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio"),
        videoUrl: data.videoUrl,
        liveTime: data.liveTime,
        liveState: '1',
        liveTag: data.liveState,
        videoDesc: data.liveDesc,
        startTime: data.startTime,
        endTime: data.endTime,
        type: 'live'
      };
    }
  } finally {
    loading.value = false
  }
}


/** 查询列表 */
const getLiveVideoPage = async () => {
  loading.value = true
  try {
    console.log('getLiveVideoPage queryParams', queryParams);
    const data = await VideoCardApi.getPage(queryParams);
    console.log('getLiveVideoPage data', data);
    if (data.list.length < queryParams.pageSize) {
      showMore.value = false;
    }
    const obJArr = data.list.map(item => {
      return {
        id: item.id,
        videoTitle: item.liveName,
        titleType: item.liveType,
        videoCover: item.liveCover,
        videoUrl: item.videoUrl,
        liveTime: item.liveTime,
        liveState: '2',
        videoDesc: item.liveDesc,
        startTime: item.startTime,
        endTime: item.endTime,
        type: 'live'
      };
    });
    liveVideoPageList.value = [...liveVideoPageList.value, ...obJArr];

    console.log('liveVideoPageList data', liveVideoPageList.value);
    liveVideoPageTotal.value = data.total;

  } finally {
    loading.value = false
  }
}

const extractNumberFromUrl = url => {
  return url.split('/').pop().split('.')[0];
}


const toVideoPage = async (videoObj) => {

  const data = await VideoCardApi.getRecent();
  if (data && data.liveState == '1') {
      const videoParams = {
        "liveId": videoObj.liveId, //直播主键ID
        "liveState": "2" //播放状态 1 录播  2直播
      };
      VideoCardApi.getAppLiveStream(videoParams).then(resData => {
        if (resData) {
          if (resData.date) {
            if (resData.date.videoUrl) {
              let token = encodeURIComponent(encryptByKeyAndIv(extractNumberFromUrl(resData.date.videoUrl.replaceAll("_",""))))
              let url = resData.date.videoUrl + '?token=' + token
              let videoUrlNew = url;
              videoUrlNew = videoUrlNew.replaceAll("http://10.188.230.39:38080", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/live");
              let videoInfo_temp = {
                  videoTitle: resData.date.liveName,
                  titleType: resData.date.liveType,
                  videoCover: resData.date.liveCover.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio"),
                  videoUrl: videoUrlNew,
                  liveTime: resData.date.liveTime,
                  liveState: '1',
                  videoDesc: resData.date.liveDesc,
                  froToEndTime: dayjs(videoObj.liveTime).format('YYYY-MM-DD HH:mm')
              };
              // 视频播放
              router.push({ path: '/h5/live-video', query: videoInfo_temp });
            }
          }
        }
      }).catch(error => {
      })
  }else{
    ElMessage(`当前直播未开始！`)
  }
  

};

const more = () => {
  queryParams.pageNo = queryParams.pageNo + 1;
  getLiveVideoPage();
}


</script>
<!-- :playback-rates="[0.7, 1.0, 1.5, 2.0]"         -->

<template>
  <div class="w-full page_container" v-loading="loading" style="background: #F6F8FA;">
    <div class="banner" v-if="Object.keys(liveNoticeInfo).length != 0">
      <img :src="liveNoticeInfo.videoCover" alt="" />
      <span class="interactive-text">{{ liveNoticeInfo.videoTitle }}</span>
      <span class="interactive-text2">{{ dayjs(liveNoticeInfo.liveTime).format('YYYY-MM-DD HH:mm') }}</span>
<!--      <span class="interactive-text3">{{ liveNoticeInfo.liveTag=='1'?'直播中':'未开始' }}</span>-->
      <span class="interactive-text3" v-if="liveNoticeInfo && liveNoticeInfo.liveTag=='1'">直播中</span>
      <span class="interactive-text4" v-if="liveNoticeInfo && liveNoticeInfo.liveTag=='0'">未开始</span>
      <div class="interactive-button1" @click="toVideoPage(liveNoticeInfo)" v-if="liveNoticeInfo && liveNoticeInfo.liveTag == '1'">观看直播</div>
      <div class="interactive-button2" @click="toVideoPage(liveNoticeInfo)" v-if="liveNoticeInfo && liveNoticeInfo.liveTag == '0'">等待直播</div>
    </div>
    <div style="margin: 10px;" v-loading="loading">
      <h1 style="color: #716d6d;font-size: 14px;margin-bottom: 12px; margin-left: 8px;">往期录屏({{ liveVideoPageTotal }})
      </h1>
      <VideoCard v-for="(item, index) in liveVideoPageList" :key="index" :data="item" @refresh="getLiveVideoPage" />
      <div class="fixed-bottom" v-if="showMore">
        <span style="display: inline-block;color: #ce6363;" @click="more">查看更多</span>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.page_container {
  height: calc(100vh - 90px);
  overflow-y: scroll;
}

.hr-solid {
  border: 0;
  border-top: 1px solid #d0d0d5;
  margin-top: 15px;
}


.banner {
  width: 96%;
  position: relative;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 12px;
}

.banner img {
  width: 100%;
  height: 185px;
  border-radius: 5px;
}


.interactive-text {
  width: 70%;
  position: absolute;
  top: 30%;
  left: 50%;
  color: white;
  white-space: normal;
  display: block;
  transform: translate(-50%, -50%);
  text-align: center;
}

.interactive-text2 {
  width: 70%;
  position: absolute;
  top: 45%;
  left: 50%;
  color: white;
  white-space: normal;
  display: block;
  transform: translate(-50%, -50%);
  text-align: center;
}

.interactive-text3 {
  position: absolute;
  top: 10%;
  left: 10%;
  color: white;
  white-space: normal;
  display: block;
  transform: translate(-50%, -50%);
  font-weight: bold;
  text-align: center;
  background: lightcoral;
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 2px;
}
.interactive-text4 {
  position: absolute;
  top: 10%;
  left: 10%;
  color: white;
  white-space: normal;
  display: block;
  transform: translate(-50%, -50%);
  font-weight: bold;
  text-align: center;
  background: rgba(150, 150, 150, 1);
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 2px;
}
.interactive-button1 {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 25px;
  background-color: rgba(255, 116, 63, 1);
  /* 半透明背景 */
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}
.interactive-button2 {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 25px;
  background-color: rgba(150, 150, 150, 1);
  /* 半透明背景 */
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.fixed-bottom {
  left: 10px;
  width: 100%;
  margin-bottom: 50px;
  text-align: center;
}
</style>