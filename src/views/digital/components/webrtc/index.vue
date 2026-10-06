<script lang="ts" setup>
import { SrsRtcPlayerAsync } from '@/utils/srs.sdk.js'

// SRS WebRTC 拉流地址，格式：webrtc://<SRS服务器>:<API端口>/<app>/<stream>
// 本地流媒体服务见 ai-digital/srs（docker-compose），默认 app=live stream=livestream
const STREAM_URL = 'webrtc://localhost:1985/live/livestream'
// 未连上 SRS / 拉流失败时，数字人「画面」回退到静态抠图
const FALLBACK_IMAGE = ''

const videoRef = ref<HTMLVideoElement | null>(null)
let sdk: ReturnType<typeof SrsRtcPlayerAsync> | null = null

onMounted(async () => {
  sdk = SrsRtcPlayerAsync()
  if (videoRef.value) {
    // sdk.stream 是同一个 MediaStream 引用，远端轨道到达后自动进入 video
    videoRef.value.srcObject = sdk.stream
  }
  try {
    await sdk.play(STREAM_URL)
  } catch (e) {
    console.warn('WebRTC 拉流失败，回退到静态占位图:', e)
  }
})

onBeforeUnmount(() => {
  sdk?.close()
  sdk = null
})
</script>

<template>
  <div class="w-full h-full relative flex items-center justify-center">
    <video
      ref="videoRef"
      :poster="FALLBACK_IMAGE"
      autoplay
      muted
      playsinline
      class="max-w-full max-h-full object-contain"
    />
  </div>
</template>
