<script lang="ts" setup>
import 'video.js/dist/video-js.css'
import {VideoPlayer} from '@videojs-player/vue'
import { getVideoById } from "@/api/digital";


defineOptions({
  name: 'AiLiveMainDetailVideo'
})

const porps = defineProps({
  videoId: {
    type: String,
    default: '' 
  },
})


//http://localhost:48080/digital-api/system/aiDhHumanVideo/getOneVideoIO?id=1721383795076555

const show = ref(true);
let data = ref({
  id: undefined,
  firstFrame: undefined,
  videoUrl: undefined,
  videoName: '',
  videoSave: undefined,
  videoStatus: undefined,
  videoType: undefined,
  videoDesc: undefined,
  videoCover: undefined,
  videoDuration: undefined,
  videoSize: undefined,
  videoCreateTime: undefined,
  videoUpdateTime: undefined,
  videoCreateUser: undefined,
  videoUpdateUser: undefined,
  videoTenantId:undefined,
})



onMounted(async () => {
  // 获取参数 id
    // const resp = await getVideoDetail({ id: porps.videoId })
    // console.log(resp)
    
    const resp = await getVideoById({ id: porps.videoId })
    data.value = resp
    console.log(data)


})

</script>

<template>
  <div
    class=" bg-#F3FAFD border border-solid border-gray-100 w-900px rounded-4px overflow-hidden shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg">
    <div class="relative bg-white">
      <VideoPlayer
        v-if="show"
        :key="data.id"
        :id="data.id"
        class="video-player vjs-big-play-centered w-900px h-600px"
        :poster="data.firstFrame"
        crossorigin="anonymous"
        :volume="0.5"
        :width="150"
        :sources="[{
           src: data.videoUrl,
           type: 'video/mp4',
        }]"
        :playback-rates="[0.7, 1.0, 1.5, 2.0]"
        :autoplay="false"
        controls
        :options="{ userActions: { doubleClick: true } }"
        :controlBar="{ children: [{ name: 'PlayToggle' }, { name: 'progressControl' }]}"
        disablePictureInPicture />
      <el-image
v-else :src="data.firstFrame"
                class="w-900px h-600px shadow-sm" fit="contain" alt="">
        <template #error></template>
      </el-image>
      <div
v-if="data.videoStatus !== '4'"
           class="absolute top-3px left-3px  border border-solid border-gray-200 rounded-2px text-red text-size-10px w-fit pl-5px pr-5px"
           >
        {{
          data.videoStatus === '1' ? '未执行' : data.videoStatus === '2' ? '执行中' : data.videoStatus === '3' ? '失败' : ''
        }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.vjs-poster){
  background-color: #fff !important;
}
:deep(.vjs-tech){
  background-color: #fff !important;
}
</style>
