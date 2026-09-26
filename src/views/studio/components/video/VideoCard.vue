<!--视频卡片-->
<script lang="tsx" setup>
import * as VideoCardApi from "@/api/h5/live";
import dayjs from 'dayjs';
import { ref } from 'vue';



defineOptions({
    name: 'VideoCard'
})

const emit = defineEmits(['videoSelect'])

const props = defineProps({
    onCreateClick: {
        type: Function,
        default: null
    },
    data: {
        type: Object,
        default: () => {
            return reactive({
                id: '',
                videoTitle: '',
                titleType: '',
                liveCover: '',
                videoUrl: '',
                liveTime: '',
                liveState: '',
                videoDesc: '',
                startTime: '',
                endTime: '',
                type: '',
                isLearn: null
            })
        }
    },
    // 添加新的 prop 来控制播放状态
    currentPlayingId: {
        type: String,
        default: ''
    }
})

// 修改 isPlaying 的计算方式，根据父组件传入的 currentPlayingId 判断
const isPlaying = computed(() => props.currentPlayingId === props.data.id)

const handleVideoClick = async (videoObj, type) => {
    let resData = {};
    let videoTitle = '';
    if(type == 'live'){
        const videoParams = {
            "liveId": videoObj.id, //直播主键ID
            "liveState": "1" //播放状态 1 录播  2直播
        };
        resData = await VideoCardApi.getAppLiveStream(videoParams);
        videoTitle = resData.date.liveName;
    }

    if(type == 'lesson'){
        const videoParams = {
            "trainId": videoObj.id, //课程主键ID
        };
        resData = await VideoCardApi.getTrainStream(videoParams);
        videoTitle = resData.date.trainName;
    }
   
    if(resData){
        // let videoUrlNew = resData.videoUrl.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio");
        let videoUrlNew = resData.date.videoUrl;
        if(videoUrlNew.startsWith("http://10.188.230.39:19001")){
            videoUrlNew = videoUrlNew.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio");
        }else if(videoUrlNew.startsWith("http://10.188.230.39:38080")){
            videoUrlNew = videoUrlNew.replaceAll("http://10.188.230.39:38080", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/live");
        }

        const videoInfo = {
            videoTitle: videoTitle,
            titleType: resData.date.liveType,
            videoCover: resData.date.liveCover.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio"),
            videoUrl: videoUrlNew,
            liveTime: resData.date.liveTime,
            liveState: '1',
            videoDesc: resData.date.liveDesc,
            froToEndTime: dayjs(videoObj.liveTime).format('YYYY-MM-DD HH:mm')
        };
        
        // 移除 isPlaying.value = true 的直接赋值
        // 改为通过 emit 事件通知父组件更新播放状态
        if(videoObj.id != props.currentPlayingId){
            emit('videoSelect', { ...videoInfo, id: videoObj.id })
        }
    }
};
</script>

<template>
    <div class="">
        <div class="card" @click="handleVideoClick(props.data, props.data.type)" :class="[data.isLearn ? 'isLearn' : '', isPlaying ? 'playing' : '']">
            <span class="learn-tag-isLearned" v-if="'isLearn' in data && data.isLearn">已学</span>
            <span class="learn-tag" v-if="'isLearn' in data && !data.isLearn">未学</span> 
            <div class="pic">
                <!-- <span style="color: #a01e1e;font-size: 12px;width: 70%;text-align: center;font-weight: bold;">{{ data.videoTitle }}</span> -->
            </div>
            <div class="card-content">
                <span style="display: block;font-size: 15px;margin-left: 20px;">{{ data.videoTitle }}</span>
                <span style="display: block;font-size: 12px;margin-left: 20px;margin-top: 6px;color: #999999;">
                    {{ dayjs(data.liveTime).format('YYYY-MM-DD HH:mm') }}
                </span> 
                <div class="to_video">
                    <span class="study-btn" :class="{ 'playing': isPlaying }">
                        <i class="status-icon" ></i>
                        {{ isPlaying ? '播放中' : '进入学习' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<style>

.learn-tag {
  position: absolute;
  background: #FFF1E3;
  padding: 5px 20px;
  color: #E83A00;
  font-size: 12px;
  right: 0;
  top: 0;
  font-weight: bold;
  border-radius: 3px;
}
.learn-tag-isLearned {
  position: absolute;
  background: #E0EDFF;
  padding: 5px 20px;
  color: #1677FF;
  font-size: 12px;
  right: 0;
  top: 0;
  font-weight: bold;
  border-radius: 3px;
}

.card {
    width: 100%;
    height: 106px;
    display: flex;
    align-items: center;
    /* background: url(../../images/card-bg.png) no-repeat; */
    /* background-size: 100% 100%; */
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 12px;
    position: relative;
    /* &.isLearn{
        background: url(../../images/card-bg1.png) no-repeat;
        background-size: 100% 100%;
    } */
    /* background-color: blanchedalmond; */
}
.card .pic{
    width: 40%;
    height: 80px;
    margin-left: 10px;
    border-radius: 5px;
    box-sizing: border-box;
    display: flex;
    /* align-items: center; */
    justify-content: center;
    background: url(../../images/pic-bg.png) no-repeat;
    background-size: 100% 100%;
    /* padding-top: 48%; */
    /* background-color: rgb(221, 92, 94); */
}
.card .pic span{
    margin-top: 24px;
}
.hr-solid {
  border: 0;
  border-top: 1px solid #d0d0d5;
  margin-top: 15px;
}
.to_video{
    color: #D71616;
    font-size: 14px;
 
    display: flex;
    margin-top: 12px;
    align-items: center;
    padding-left: 20px;
}
.to_video img{
    width: 15px;
    height: 15px;
    margin-left: 4px;
}

.card-content {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
}

.to_video {
    display: flex;
    justify-content: flex-end;
}

.study-btn {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    background: #E83A00;
    color: #ffffff;
    font-size: 12px;
    border-radius: 20px;
    font-weight: bold;
    margin-right: 10px;
}

.status-icon {
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid #fff;
    border-bottom: 6px solid transparent;
    margin-right: 5px;
}

.study-btn.playing .status-icon {
    width: 12px;
    height: 12px;
    border: none;
    background: url('../../images/play.gif') no-repeat center center;
    background-size: contain;
}
</style>