<!-- 课程直播-->
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';
import { VideoCard } from "./components";
import { ElMessage } from 'element-plus';
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';

import * as VideoCardApi from "@/api/h5/lesson";
import { Calendar, Search } from '@element-plus/icons-vue'


/** 初始化 **/
// onMounted(() => {
//   getNotLearnedCount();
//   getVideoPage();
//   ElMessage.warning(notLearnedCount.value);
// })
onMounted(async () => {
  try {
    await getNotLearnedCount();
    await getVideoPage();
    ElMessage.warning(`未学习数量：${notLearnedCount.value}`);
  } catch (error) {
    ElMessage.error('加载数据失败');
    console.error(error);
  }
});

// 添加 props 接收播放ID
defineProps({
  currentPlayingId: {
    type: String,
    default: ''
  }
})

const userStore = useUserStore()
const userId = computed(() => userStore.user.id)

const loading = ref(false)

const videoPageList = ref([]);// 列表的数据
const videoPageTotal = ref(0);// 列表的数据
const notLearnedCount = ref(0);
const showMore = ref(true);// 列表的数据
const debounceTimer = ref(null);
// 添加分页配置常量
const PAGE_CONFIG = {
  DEFAULT_PAGE_NO: 1,
  DEFAULT_PAGE_SIZE: 20
}

const queryParams = reactive({
  pageNo: PAGE_CONFIG.DEFAULT_PAGE_NO,
  pageSize: PAGE_CONFIG.DEFAULT_PAGE_SIZE,
  staffId: userId,
  keyWord: '',
  videoSign: '',
  trainType: '',
  isLearn: ''
})

const search = () => {
    videoPageList.value = [];
    clearTimeout(debounceTimer.value);
    queryParams.isLearn = '';
    // 使用常量重置分页参数
    queryParams.pageNo = PAGE_CONFIG.DEFAULT_PAGE_NO;
    debounceTimer.value = setTimeout(() => {
      getVideoPage();
      getNotLearnedCount();
    }, 500);
}

const searchNotLearn = () => {
    videoPageList.value = [];
    clearTimeout(debounceTimer.value);
    queryParams.isLearn = '0';
    // 使用常量重置分页参数
    queryParams.pageNo = PAGE_CONFIG.DEFAULT_PAGE_NO;
    debounceTimer.value = setTimeout(() => {
      getVideoPage();
      getNotLearnedCount();
    }, 500);
}

// 修改refreshData方法
const refreshData = () => {
  queryParams.keyWord = '';
  queryParams.videoSign = '';
  queryParams.trainType = '';
  queryParams.isLearn = '';
  // 使用常量重置分页参数
  queryParams.pageNo = PAGE_CONFIG.DEFAULT_PAGE_NO;
  videoPageList.value = [];
  getVideoPage();
  getNotLearnedCount();
};


/** 查询列表 */
const getNotLearnedCount = async () => {
  loading.value = true
  try {
    console.log('getNotLearnedCount queryParams', queryParams);
    const data = await VideoCardApi.getNotLearnedCount(queryParams);
    console.log('getNotLearnedCount data', data);
    notLearnedCount.value = data;
    
  } finally {
    loading.value = false
  }
}



/** 查询列表 */
const getVideoPage = async () => {
  loading.value = true
  try {
    showMore.value = true;
    console.log('getVideoPage queryParams', queryParams);
    const data = await VideoCardApi.getApplist(queryParams);
    console.log('getVideoPage data', data);
    if(data){
      if(data.list.length < queryParams.pageSize ){
        showMore.value = false;
      } else {
        showMore.value = true;
      }
      const obJArr = data.list.map(item => {
      return {
        id: item.id,
        videoTitle: item.trainName,
        titleType: item.trainType,
        videoCover: item.liveCover,
        videoUrl: item.videoUrl,
        liveTime: item.updateTime,
        liveState: '1',
        videoDesc: item.liveDesc,
        isLearn: item.isLearn,
        type: 'lesson'
      };
    });
      videoPageList.value = [...videoPageList.value, ...obJArr];
      videoPageTotal.value = data.total;
    } else {
      showMore.value = false;
    }

  } finally {
    loading.value = false
  }
}




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

const more = () => {
  queryParams.pageNo = queryParams.pageNo + 1;
  getVideoPage();
}


const emit = defineEmits(['videoSelect'])

const handleVideoSelect = (videoInfo) => {
  emit('videoSelect', videoInfo)
}
</script>
<!-- :playback-rates="[0.7, 1.0, 1.5, 2.0]"         -->

<template>
  <div class="w-full page_container" >
    <div class="fixed-top">
      <div style="margin: 10px;">
        <div class="grey">
          <el-input
            type="text"
            v-model="queryParams.keyWord"
            placeholder="输入课程名称搜索"
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
        <div class="radius" style="display: flex; align-items: center; margin-top: 15px;">
          <el-select
            style="width: 30%; cursor: pointer; text-align: center; "
            v-model="queryParams.videoSign"
            placeholder="时间排序"
            @change="search">
              <el-option label="最新发布" value="0" />
              <el-option label="最近一周" value="1" />
              <el-option label="最近一个月" value="2" />
              <el-option label="最近三个月" value="3" />
          </el-select>
          <el-select
            style="width: 30%; cursor: pointer; text-align: center; margin-left: 5px;" 
            v-model="queryParams.trainType"
            placeholder="课程类型"
            @change="search">
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.TRAIN_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          
          <div style="color: #D71616;font-size: 13px; margin-left:auto;" @click="searchNotLearn">&#x24D8;<span style="margin-left: 4px;">{{ notLearnedCount }}个视频未学习</span></div>
        </div>
      </div>
    </div>

    <div v-loading="loading">
      <div style="margin:10px;">
        <VideoCard 
          v-for="(item, index) in videoPageList" 
          :key="index" 
          :data="item" 
          @refresh="getVideoPage"
          @videoSelect="handleVideoSelect"
          :current-playing-id="currentPlayingId"
        />
        <div class="fixed-bottom" v-if="showMore">
          <span style="display: inline-block;color: #ce6363;" @click="more">查看更多</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout;

.#{$prefix-cls} {
  background-color: var(--app-content-bg-color);
  :deep(.#{$elNamespace}-scrollbar__view) {
    height: 99% !important;
  }
}


.page_container{
  // height: calc(100vh - 90px);
  // overflow-y: scroll;
  background: #F6F8FA;
}

.fixed-top {
    // position: fixed;
    margin-top: -10px;
    left: 0;         /* 距离左侧 0 */
    width: 100%;     /* 宽度 100% */
    height: 100px;
    background-color: #fff; /* 背景颜色 */

    z-index: 999;   /* 设置较高的 z-index 值 */
}

.el-input__inner {
  &::placeholder {
    text-align: center;
    width: 100%;
  }
}


.hr-solid {
  border: 0;
  border-top: 1px solid #d0d0d5;
  margin-top: 15px;
}


.banner {
  width: 100%;
}

.banner img{
  width: 100%;
  height: 250px;
}


.interactive-text {  
  width: 70%;
  position: absolute;  
  top: 75px;  
  left: 50%;
  color: white;
  white-space: normal;
  display: block;
  transform: translate(-50%, -50%);  
  font-size: 22px;
  font-weight: bold; 
  text-align: center;
} 


.interactive-text2 {  
  width: 70%;
  position: absolute;  
  top: 110px;  
  left: 50%;
  color: white;
  white-space: normal;
  display: block;
  transform: translate(-50%, -50%); 
  text-align:center; 
} 


.interactive-button {  
  position: absolute;  
  top: 170px;  
  left: 50%;  
  transform: translate(-50%, -50%);  
  padding: 8px 25px;  
  background-color: rgba(22, 22, 255, 1); /* 半透明背景 */  
  color: white;  
  text-align: center;  
  text-decoration: none;  
  font-size: 15px;  
  border: none;  
  cursor: pointer;  
  transition: background-color 0.3s ease;  
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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 确保el-select和按钮在同一行对齐 */
.el-select {
  vertical-align: top;
}
// :deep(.grey .el-input__wrapper){
//   background: #F6F8FA;
//   box-shadow: none;
//   border-radius: 20px;
// }
:deep(.radius .el-select__wrapper){
  border-radius: 20px;
  box-shadow: none;
  border: 1px solid #DBDBDB;
}

</style>
