<script lang="ts" setup>
// 本地环境无 SRS 流媒体服务，数字人「画面」用静态抠图占位。
// 连到内网 SRS 后，可恢复 WebRTC 播放逻辑（见 git 历史 webrtc 版本）。
// TODO: 待接本地口型服务后，改为播放 /ai/humanInteract 返回的合成视频。
const humanImage = 'http://localhost:9000/aidigital/1790222776175122/image/1790222776175122_rgba.png'
</script>

<template>
  <div class="w-full h-full relative flex items-center justify-center">
    <img :src="humanImage" alt="数字人" class="max-w-full max-h-full object-contain" />
  </div>
</template>
