<!--视频卡片-->
<script lang="ts" setup>
import {getAccessToken, getTenantId} from '@/utils/auth'
import {shallowRef} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import 'video.js/dist/video-js.css'
import {VideoPlayer} from '@videojs-player/vue'
import {MoreView} from '../'
import { deleteVideo, renameVideo, downloadVideo } from "@/api/digital";
import download from '@/utils/download'

const {t} = useI18n()
const router = useRouter()
defineOptions({
  name: 'CardVideo'
})
const emit = defineEmits(['refresh'])
const porps = defineProps({
  type: {
    type: String,
    default: '1' // 1: 草稿 2: 成品
  },
  cardType: {
    type: String,
    default: '1' // 1: 视频 2: 卡片
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const moreData = [

  {
    name: '删除',
    icon: 'system-uicons:trash',
    onClick: () => {
      ElMessageBox.confirm(t('common.delMessage'), t('common.confirmTitle'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await deleteVideo({id: porps.data.id})
        emit('refresh')
        ElMessage.success(t('common.delSuccess'))
      })
    }
  },
  {
    name: '重命名',
    icon: 'system-uicons:pen',
    onClick: () => {
      ElMessageBox.prompt('请重新输入视频名称', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(async ({value}) => {
          await renameVideo({id: porps.data.id, videoName: value})
          ElMessage({
            type: 'success',
            message: `重命名成功`,
          })
          emit('refresh')
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Input canceled',
          })
        })
    }
  },
  // {
  //   name: '创建副本',
  //   icon: 'system-uicons:clipboard-copy',
  //   click: () => {
  //     console.log('创建副本');
  //   }
  // }
]
watchEffect(() => {
  if (porps.data.videoSave === '0') {
    // 草稿 moreData 在第一个
    if (moreData.find(item => item.name === '编辑'))
      moreData.splice(moreData.findIndex(item => item.name === '编辑'), 1)
    moreData.unshift({
      name: '编辑',
      icon: 'system-uicons:create',
      onClick: () => {
        console.log('编辑');

        router.push({path: '/digital/video-prod', query: {id: porps.data.id}})
      }
    })
  }
  if (porps.data.videoStatus === '4') {
  if (!moreData.find(item => item.name === '下载')) {
    moreData.push({
      name: '下载',
      icon: 'system-uicons:download',
      onClick: () => {
        //porps.data.videoUrl
        downloadVideo(porps.data.videoUrl).then((resp) => {
          download.video(resp,porps.data.videoName + '.mp4')
        ElMessage({
          type: 'success',
          message: '下载成功',
        })
      }).catch(() => {
        ElMessage({
          type: 'error',
          message: '下载失败',
        })
      })
      }
    })
  }
  }
})
//http://localhost:48080/digital-api/system/aiDhHumanVideo/getOneVideoIO?id=1721383795076555

const show = ref(false);

const player = shallowRef<any>(null);
const handleMounted = (payload) => {
  player.value = payload.player
  // player.value.type = 'application/x-mpegURL';
  // getVideoIO({ id: porps.data.id }).then(resp => {
  //   console.log(resp);
  // })

}
let timerId: NodeJS.Timeout | null = null;
const onMouseEnter = () => {
  if (porps.data.videoStatus === '4') {
    if(timerId)
      clearTimeout(timerId);
  timerId = setTimeout(() => {
    show.value = true;
    if (player.value) {
      player.value.autoplay();
    }
  }, 800);
  }
  

};

const onMouseLeave = () => {
  if (timerId) {
    clearTimeout(timerId);
    // show.value = false;
    timerId = null;
    if (player.value) {
      console.log('暂停');
      // player.value.pause();
      // player.value.ended();
      // player.value.dispose()
    }
  }
};

const handleReady = () => {
  // https://github.com/videojs/http-streaming#vhsxhr
  const {vhs} = player.value?.tech() as any
  vhs.xhr.beforeRequest = (options: any) => {
    console.log('vhs.xhr.beforeRequest', options)
    options.headers = {
      'Authorization': 'Bearer ' + getAccessToken()
    }
    // do something...
    return options
  }
  vhs.xhr.setRequestHeader('Authorization', 'Bearer ' + getAccessToken());
}

const handleEvent = (payload) => {
  console.log('handleEvent', payload)
}
</script>

<template>
  <div
    class=" bg-#F3FAFD border border-solid border-gray-100 w-150px rounded-4px overflow-hidden shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg">
    <div class="relative bg-white" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <VideoPlayer
        v-if="show"
        :key="data.id"
        :id="data.id"
        @mounted="handleMounted"
        @waiting="handleEvent"
        class="video-player vjs-big-play-centered w-150px h-100px"
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
      <div v-else class="w-150px h-100px shadow-sm flex items-center justify-center bg-white">
        <el-icon v-if="data.videoStatus === '2'" class="is-loading text-size-30px text-#409eff">
          <Loading />
        </el-icon>
        <el-image
          v-else
          :src="data.firstFrame"
          class="w-150px h-100px"
          fit="contain"
          alt=""
        >
          <template #error></template>
        </el-image>
      </div>
      <div
        class="absolute bottom-5px  right-3px rounded-10px text-#D7D7D7 text-size-10px w-fit pl-5px pr-5px "
        style="background-color: rgba(2, 167, 240, 0.45098039215686275);">
        {{ cardType === "0" ? "视频" : "卡片" }}
      </div>
      <div
v-if="data.videoStatus !== '4'"
           class="absolute top-3px left-3px  border border-solid border-gray-200 rounded-2px text-red text-size-10px w-fit pl-5px pr-5px"
           >
        {{
          data.videoStatus === '1' ? '未执行' : data.videoStatus === '2' ? '执行中' : data.videoStatus === '3' ? '失败' : ''
        }}
      </div>
    </div>
    <div class="text-size-14px flex justify-between items-center text-#666666 p-5px pt-10px pb-10px">
      <div class="flex flex-col gap-2">
        <div class="w-127px truncate">{{ data.videoName }}</div>
        <div class="text-size-12px" v-if="data.oprTime">{{ data.oprTime }}</div>
      </div>
      <MoreView :data="moreData"/>
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
