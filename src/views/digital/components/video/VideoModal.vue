<!--视频播放弹窗-->
<script lang="ts" setup>
import { shallowRef, ref } from 'vue';
import 'video.js/dist/video-js.css'
import { VideoPlayer } from '@videojs-player/vue'
defineOptions({
  name: 'VideoModal'
})
const porps = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        url: '',
        poster: ''
      }
    }
  },
  value: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['input'])
const dialogVisible = ref(false);

const player = shallowRef(null);
const handleMounted = (payload) => {
  player.value = payload.player
  player.value.src(porps.data.url);
  player.value.autoplay('muted');
}
watchEffect(() => {
  dialogVisible.value = porps.value;
})
watch(dialogVisible, (val) => {
  emit('input', val)
})


</script>

<template>
  <el-dialog v-model="dialogVisible">
    <VideoPlayer
        @mounted="handleMounted"
        class="video-player vjs-big-play-centered w-full"
        :poster="data.poster"
        crossorigin="anonymous"
        :volume="0.6" 
        :playback-rates="[0.7, 1.0, 1.5, 2.0]"
        playsinline
        controls />
  </el-dialog>
</template>
