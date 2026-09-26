<!--音频录制控件-->
<script lang="ts" setup>
import { getVoice2Tx } from '@/api/digital/chatAPI'
import { useRecord } from './useRecord'
const emit = defineEmits(['start', 'end', 'cancel', 'text'])

const btnTextMap = reactive({
  inited: '按住 说话',
  recording: '松开 发送',
  willCancel: '松开 发送'
})
const btnPcTextMap = reactive({
  inited: '点击 说话',
  recording: '点击 发送',
  willCancel: '点击 发送'
})
const status = ref('inited')
const ts = ref(0)
const startY = ref(0)
const btnRef = ref()
const { loading, recording, confirmRecording, visualizerData } = useRecord((file) => {
  if (unref(status) === 'cancel') {
    return Promise.reject('cancel')
  }
  if (!file || file.size === 0) {
    return Promise.reject('file error')
  }
  const formData = new FormData()
  formData.append('file', file)
  return getVoice2Tx(formData).then((resp) => {
    if (resp.code === 0) {
      emit('text', resp.data)
    }
  })
})
const canUse = () => {
  let supportsPassive = false
  try {
    const opts = Object.defineProperty({}, 'passive', {
      // eslint-disable-next-line
      get() {
        supportsPassive = true
      }
    })
    // @ts-ignore
    window.addEventListener('test', null, opts)
  } catch (e) {
    // No support
  }
  return supportsPassive
}
const canPassive = canUse()
const listenerOptsWithoutPassive = canPassive ? { passive: false } : false
const MOVE_INTERVAL = 40

const doEnd = () => {
  status.value = 'inited'
  const duration = Date.now() - unref(ts)
  emit('end', duration)
}
const handleTouchStart = (e: TouchEvent) => {
  if (isPC()) return
  if (e.cancelable) {
    e.preventDefault()
  }

  if (unref(loading)) return
  const touch0 = (e.touches && e.touches[0]) || e
  startY.value = touch0.pageY
  ts.value = Date.now()
  status.value = 'recording'
  recording.value = true
  console.log('touchstart')
  emit('start')
}
const handleTouchEnd = (e) => {
  console.log('touchend')
  if (isPC()) return
  if (!unref(ts)) return
  const duration = Date.now() - unref(ts)
  if (duration < 1000) {
    status.value = 'cancel'
    recording.value = false
    console.log('cancel')
    // confirmRecording()
    return
  }
  const endY = (e.changedTouches && e.changedTouches[0].pageY) || e.pageY
  const isRecording = unref(startY) - endY < MOVE_INTERVAL

  confirmRecording()
  if (isRecording) {
    doEnd()
    return
  }
  status.value = 'cancel'
  emit('cancel')
}
onMounted(async () => {
  await nextTick()
  const wrapper = unref(btnRef)
  if (!wrapper) return
  wrapper.addEventListener('touchstart', handleTouchStart, listenerOptsWithoutPassive)
  wrapper.addEventListener('touchend', handleTouchEnd, listenerOptsWithoutPassive)
  wrapper.addEventListener('touchcancel', handleTouchEnd)
})
onUnmounted(() => {
  const wrapper = unref(btnRef)
  if (!wrapper) return
  wrapper.removeEventListener('touchstart', handleTouchStart)
  wrapper.removeEventListener('touchend', handleTouchEnd)
  wrapper.removeEventListener('touchcancel', handleTouchEnd)
})
const isPC = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  return !isMobile
}
const onClick = () => {
  // 判断是否pc
  if (isPC()) {
    console.log('isPC')
    const recording1 = unref(recording)
    if (!recording1) {
      console.log('recording')
      status.value = 'recording'
      recording.value = true
    } else {
      console.log('not recording')
      status.value = 'inited'
      recording.value = false
      confirmRecording()
    }
  }
}
</script>

<template>
  <div
    class="text-size-14px flex w-full h-full rounded-50% transition-all relative bg-white cursor-pointer"
    ref="btnRef"
    @click="onClick"
  >
    <div v-if="status === 'recording'" class="w-full h-full bg-blue absolute flex items-center">
      <div class="w-full h-full flex items-center gap-0.5 h-6">
        <div
          v-for="(rms, i) in visualizerData.slice().reverse()"
          :key="i"
          class="bg-indigo-500 dark:bg-indigo-400 inline-block h-full w-[2px]"
          :style="{ height: Math.min(100, Math.max(14, rms * 100)) + '%' }"
        ></div>
      </div>
    </div>

    <div class="w-full h-full z-1 absolute flex justify-center items-center">
      <span v-if="!loading">{{ isPC() ? btnPcTextMap[status] : btnTextMap[status] }}</span>
      <div v-else class="text-gray-500 rounded-full cursor-not-allowed">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <g class="spinner_OSmW">
            <rect x="11" y="1" width="2" height="5" opacity=".14" />
            <rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29" />
            <rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43" />
            <rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57" />
            <rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71" />
            <rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86" />
            <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
<style>
.spinner_OSmW {
  transform-origin: center;
  animation: spinner_T6mA 0.75s step-end infinite;
}
@keyframes spinner_T6mA {
  8.3% {
    transform: rotate(30deg);
  }
  16.6% {
    transform: rotate(60deg);
  }
  25% {
    transform: rotate(90deg);
  }
  33.3% {
    transform: rotate(120deg);
  }
  41.6% {
    transform: rotate(150deg);
  }
  50% {
    transform: rotate(180deg);
  }
  58.3% {
    transform: rotate(210deg);
  }
  66.6% {
    transform: rotate(240deg);
  }
  75% {
    transform: rotate(270deg);
  }
  83.3% {
    transform: rotate(300deg);
  }
  91.6% {
    transform: rotate(330deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
