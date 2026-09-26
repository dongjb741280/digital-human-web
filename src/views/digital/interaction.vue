<script lang="ts" setup>
import Chat from '@/views/digital/components/chat/index.vue'
import DigitalHuman from '@/views/digital/components/webrtc/index.vue'
import ViewModal from '@/views/digital/components/viewModal/index.vue'
const videoContainer = ref<HTMLDivElement | null>(null)
const scaleR = ref(1)
const wh = reactive({
  width: 0,
  height: 0
})
const tempLayers = [
  {
    name: 'Human',
    width: 560,
    height: 1280,
    x: 43.46304076856483,
    y: 175.95330459112185,
    scaleWidth: 560,
    scaleHeight: 1280
  },
  {
    name: 'BackGround',
    width: 700,
    height: 1302,
    x: 0,
    y: 0,
    scaleWidth: 839.667,
    scaleHeight: 472.31268750000004
  },
  {
    name: 'PPT',
    width: 1333,
    height: 750,
    x: 958.5003751629873,
    y: 122.86022171576342,
    scaleWidth: 891.2463136562105,
    scaleHeight: 501.4514142851893
  },
  {
    name: 'Chat',
    width: 700,
    height: 1302,
    x: 534.6728439395422,
    y: 273.00845580749433,
    scaleWidth: 435.05434777170757,
    scaleHeight: 809.2010868553762
  }
]
const layers = ref<any[]>([])
const resizeHandler = async () => {
  if (videoContainer.value) {
    let Rect16_9, Rect9_16
    let style = getComputedStyle(videoContainer.value)
    let width = parseFloat(style.width)
    let height = parseFloat(style.height)
    if (width < (16 / 9) * height) {
      Rect16_9 = [width, height * (width / ((16 / 9) * height))]
    } else {
      Rect16_9 = [(16 * height) / 9, height]
    }
    Rect9_16 = [(9 / 16) * height, height]
    // 3840x2160 4k  2560x1440 2k  1920x1080 1080p
    scaleR.value = Number(Rect16_9[0]) / 1920

    wh.width = Rect16_9[0]
    wh.height = Rect16_9[1]

    layers.value = tempLayers.map((item) => ({
      name: item.name,
      style: {
        left: item.x * scaleR.value + 'px',
        top: item.y * scaleR.value + 'px',
        width: item.scaleWidth * scaleR.value + 'px',
        height: item.scaleHeight * scaleR.value + 'px'
      }
    }))
    console.log(layers.value)
    console.log(wh)
  }
}

const styleDiv = computed(() => {
  return {
    width: wh.width + 'px',
    height: wh.height + 'px'
  }
})
const viewSacle = ref(0.4)
const viewModalHeight = computed(() => {
  return {
    // maxHeight: ((wh.width * viewSacle.value) / 16) * 9 + 'px',
    maxWidth: viewSacle.value * 100 + '%'
  }
})
const modalData = reactive<{
  type: string // 1 图片， 2 视频  form: 表单
  data: any
}>({
  type: '1',
  data: {}
})

const onShow = (item: any) => {
  modalData.type = item.dataType
  modalData.data = {
    url: item.dataUrl,
    ...item
  }
  show.value = true
  console.log(modalData, show.value)
}
const show = ref(false)
onMounted(() => {
  nextTick(() => {
    resizeHandler()
  })
})
const hanldeScale = () => {
  if (viewSacle.value >= 0.7) {
    viewSacle.value = 0.4
    return
  }
  viewSacle.value += 0.1
}
</script>

<template>
  <div
    class="w-full h-full min-h-80vh flex items-center justify-center bg-white"
    ref="videoContainer"
  >
    <div
      class="relative bg-[url(http://localhost:9000/aidigital/asset/background/default.jpg)] bg-no-repeat bg-left-top bg-cover box-border"
      :style="styleDiv"
    >
      <!--  <div
      class="relative bg-[url(http://132.160.6.41:9100/aidigital/background/bg_20240929_02.jpg)] bg-no-repeat bg-left-top bg-cover box-border"
      :style="styleDiv"
    > -->
      <DigitalHuman class="absolute bottom-0px left-10px w-30% h-80%" />
      <Chat class="absolute bottom-10px left-26% w-30% top-10%" @on-show-modal="onShow" />
      <ViewModal
        v-model:show="show"
        :data="modalData"
        @on-click-scale="hanldeScale"
        class="absolute top-10% right-40px rounded-4px transition-all"
        :style="viewModalHeight"
      />
    </div>
  </div>
</template>
