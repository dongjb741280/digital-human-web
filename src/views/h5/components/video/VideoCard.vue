<!--视频卡片-->
<script lang="tsx" setup>
import * as VideoCardApi from "@/api/h5/live";
import dayjs from 'dayjs';



defineOptions({
    name: 'VideoCard'
})
const router = useRouter()
const videoInfo = ref({});// 列表的数据


const props = defineProps({
    onCreateClick: {
        type: Function,
        default: null // 如果父组件没有提供函数，默认为null
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
    }
})


const toVideoPage = async (videoObj, type) => {
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
        console.log(resData);
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

      videoInfo.value = {
            videoTitle: videoTitle,
            titleType: resData.date.liveType,
            videoCover: resData.date.liveCover.replaceAll("http://10.188.230.39:19001", "https://ibosd.10010.com/heilongjiang/wosaleapp/ai-digital-app/minio"),
            videoUrl: videoUrlNew,
            liveTime: resData.date.liveTime,
            liveState: '1',
            videoDesc: resData.date.liveDesc,
            froToEndTime: dayjs(videoObj.liveTime).format('YYYY-MM-DD HH:mm')
        };
        // 视频播放
        router.push({ path: '/h5/live-video', query: videoInfo.value });
    }
};



</script>

<template>
    <div class="">
        <!-- <hr class="hr-solid"/> -->
        <div class="card" @click="toVideoPage(props.data, props.data.type)" :class="data.isLearn ? 'isLearn' : '' ">
            <div class="pic">
                <span style="color: #a01e1e;font-size: 12px;width: 70%;text-align: center;font-weight: bold;">{{ data.videoTitle }}</span>
            </div>
            <div>
                <span style="display: block;font-size: 15px;margin-left: 20px;">{{ data.videoTitle }}</span>
                <span style="display: block;font-size: 12px;margin-left: 20px;margin-top: 6px;color: #999999;">
                    {{ dayjs(data.liveTime).format('YYYY-MM-DD HH:mm') }}
                    <span class="learn-tag-isLearned" v-if="'isLearn' in data && data.isLearn">已学</span>
                    <span class="learn-tag" v-if="'isLearn' in data && !data.isLearn">未学</span> 
                </span> 
                <div class="to_video">进入学习 <img src="../../images/icon-arrow.png" alt=""></div>
                
            </div>
            
        </div>
    </div>
</template>
<style>

.learn-tag {
  position: absolute;
  background: #FFF1E3;
  padding: 4px 10px;
  color: #E83A00;
  font-size: 12px;
  right: 0;
  top: 12px;
  font-weight: bold;
  border-radius: 3px;
}
.learn-tag-isLearned {
  position: absolute;
  background: #E0EDFF;
  padding: 4px 10px;
  color: var(--dh-primary);
  font-size: 12px;
  right: 0;
  top: 12px;
  font-weight: bold;
  border-radius: 3px;
}

.card {
    width: 100%;
    height: 106px;
    display: flex;
    align-items: center;
    background: url(../../images/card-bg.png) no-repeat;
    background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 12px;
    position: relative;
    &.isLearn{
        background: url(../../images/card-bg1.png) no-repeat;
        background-size: 100% 100%;
    }
    /* background-color: blanchedalmond; */
}
.card .pic{
    width: 30%;
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
    color: var(--dh-primary);
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

</style>