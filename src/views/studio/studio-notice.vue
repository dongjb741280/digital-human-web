<!-- 课程直播-->
<script lang="tsx" setup>
import { VideoCard } from "./components";
import { encryptByKeyAndIv } from "@/utils/crypto";
import * as VideoCardApi from "@/api/h5/live";
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus'

/** 初始化 **/
onMounted(() => {
  refreshData()
})

// 添加 props 接收播放ID
defineProps({
  currentPlayingId: {
    type: String,
    default: ''
  }
})


const router = useRouter()

const loading = ref(false)

const liveVideoPageList = ref([]);// 列表的数据
const liveVideoPageTotal = ref(0);// 列表的数据
const liveNoticeInfo = ref({});// 列表的数据
const videoInfo = ref({});// 列表的数据
const showMore = ref(true);// 列表的数据

// 添加分页配置常量
const PAGE_CONFIG = {
  DEFAULT_PAGE_NO: 1,
  DEFAULT_PAGE_SIZE: 20
}

const queryParams = reactive({
  pageNo: PAGE_CONFIG.DEFAULT_PAGE_NO,
  pageSize: PAGE_CONFIG.DEFAULT_PAGE_SIZE,
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
    } else {
      showMore.value = true;
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
    const resData = await VideoCardApi.getAppLiveStream(videoParams);
    if (resData && resData.date && resData.date.videoUrl) {
      let token = encodeURIComponent(encryptByKeyAndIv(extractNumberFromUrl(resData.date.videoUrl.replaceAll("_",""))))
      let url = resData.date.videoUrl + '?token=' + token
      let videoUrlNew = url;
      videoUrlNew = videoUrlNew.replaceAll("http://10.188.230.39:38080", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/live");
      const videoInfo = {
        videoTitle: resData.date.liveName,
        titleType: resData.date.liveType,
        videoCover: resData.date.liveCover.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio"),
        videoUrl: videoUrlNew,
        liveTime: resData.date.liveTime,
        liveState: '1',
        videoDesc: resData.date.liveDesc,
        froToEndTime: dayjs(videoObj.liveTime).format('YYYY-MM-DD HH:mm')
      };
      emit('videoSelect', videoInfo);
    }
  } else {
    ElMessage(`当前直播未开始！`)
  }
};

// 修改refreshData方法
const refreshData = () => {
  queryParams.liveName = '';
  // 使用常量重置分页参数
  queryParams.pageNo = PAGE_CONFIG.DEFAULT_PAGE_NO;
  liveVideoPageList.value = [];

  getLiveNoticeInfo();
  getLiveVideoPage();
};

// 添加旋转状态
const isRotating = ref(false);

// 修改handleRefresh方法
const handleRefresh = () => {
  isRotating.value = true;
  refreshData();
  
  // 1秒后停止旋转
  setTimeout(() => {
    isRotating.value = false;
  }, 600);
};

const search = () => {
  queryParams.pageNo = PAGE_CONFIG.DEFAULT_PAGE_NO;
  liveVideoPageList.value = [];
  getLiveVideoPage();
}

const more = () => {
  queryParams.pageNo = queryParams.pageNo + 1;
  getLiveVideoPage();
}


const emit = defineEmits(['videoSelect'])
// 移除原有的 toVideoPage 方法，改为事件转发
const handleVideoSelect = (videoInfo) => {
  emit('videoSelect', videoInfo)
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
      <div class="grey">
          <el-input
            type="text"
            v-model="queryParams.liveName"
            placeholder="输入直播名称搜索"
            style="width: 100%; cursor: pointer; text-align: center; border-radius: 25px;"
            @input="search"
            clearable
            >
            <template #append>
              <div class="refresh-btn" @click="handleRefresh">
                <img src="./images/icon-reset.png" class="refresh-icon" :class="{ 'rotating': isRotating }">
                <span class="refresh-text">重置</span>
              </div>
            </template>
          </el-input>
        </div>
      <VideoCard 
        v-for="(item, index) in liveVideoPageList" 
        :key="index" 
        :data="item" 
        @refresh="getLiveVideoPage"
        @videoSelect="handleVideoSelect"
        :current-playing-id="currentPlayingId"
      />
      <div class="fixed-bottom" v-if="showMore">
        <span style="display: inline-block;color: #ce6363;" @click="more">查看更多</span>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.page_container {
  // height: calc(100vh - 90px);
  // overflow-y: scroll;
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

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;

  &:hover {
    background-color: #f5f7fa;
    .refresh-text {
      color: #409EFF;
    }
  }
}

.refresh-icon {
  width: 15px;
  height: 15px;
}

.refresh-text {
  font-size: 14px;
  color: #606266;
  transition: color 0.3s;
}

.refresh-icon.rotating {
  animation: spin 1s linear infinite;
}
</style>
