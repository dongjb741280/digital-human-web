<!-- 视频 组件 -->
<script lang="ts" setup>
import 'video.js/dist/video-js.css'
import { VideoPlayer } from '@videojs-player/vue'

const porps = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        url: '',
        poster: ''
      }
    }
  }
})
watch(
  () => porps.data,
  async () => {
    console.log('porps.data', porps.data)
    if (player.value) {
      await getAspectRatio(porps.data.url)
      player.value.src(porps.data.url)
      player.value.autoplay('muted')
    }
    // player.value?.src(porps.data.url)
  }
)
const aspectRatio = ref('16:9')
console.log('porps.data', porps.data)
const player = shallowRef<any>(null)
const handleMounted = async (payload) => {
  player.value = payload.player
  if (player.value) {
    const url = (porps.data as { url: string }).url
    await getAspectRatio(url)
    player.value.src(url)
    player.value.autoplay('muted')
  }
}
const getAspectRatio = (url: string) => {
  return getVideoFirstFrame(url).then(({ width, height }) => {
    console.log('width', width, 'height', height)
    if (width === 0 || height === 0) {
      return
    }
    // 根据宽高比计算出视频的宽高比
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b)) // 用于计算最大公约数
    const ratioGCD = gcd(width, height)
    const normalizedWidth = width / ratioGCD
    const normalizedHeight = height / ratioGCD
    const aspectRatio1 = `${normalizedWidth}:${normalizedHeight}`
    console.log('aspectRatio', aspectRatio1)
    aspectRatio.value = aspectRatio1
  })
}
const getVideoFirstFrame = (videoUrl): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous' // 如果视频来自不同域，需要设置这个
    video.src = videoUrl
    video.muted = true // 静音，避免播放声音
    video.playsInline = true // 在iOS上内联播放
    video.onloadedmetadata = () => {
      video.currentTime = 0
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageDataUrl = canvas.toDataURL('image/png')

      const img = new Image()

      img.src = imageDataUrl

      img.onload = function () {
        const width = img.width
        const height = img.height
        resolve({ width, height })
      }

      img.onerror = function () {
        resolve({ width: 0, height: 0 })
      }

      video.remove()
    }

    video.load()
  })
}
</script>

<template>
  <div
    class="absolute right-0 top-0 w-80% box-border"
    style="
      box-shadow:
        rgba(9, 30, 66, 0.25) 0px 1px 1px,
        rgba(9, 30, 66, 0.13) 0px 0px 1px 1px,
        rgba(0, 0, 0, 0.5) 0px 0.0625em 0.0625em,
        rgba(0, 0, 0, 0.25) 0px 0.5em 0.5em,
        rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset;
    "
  >
    <VideoPlayer
      @mounted="handleMounted"
      class="video-player vjs-big-play-centered w-full !bg-transparent"
      :poster="data.poster"
      crossorigin="anonymous"
      :aspect-ratio="aspectRatio"
      :volume="0.6"
      :playback-rates="[0.7, 1.0, 1.5, 2.0]"
      playsinline
      controls
    />
  </div>
</template>
