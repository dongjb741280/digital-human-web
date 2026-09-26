<script lang="ts" setup>
import Chat from '@/views/digital/components/chat/index.vue'
import ViewModal from '@/views/digital/components/viewModal/index.vue'
import IntelligentAssistant from '@/layout/components/chat-h5/modules/IntelligentAssistant.vue'
const videoContainer = ref<HTMLDivElement | null>(null)
const scaleR = ref(1)
const isSending = ref(false)
const wh = reactive({
  width: 0,
  height: 0
})
const tempLayers = [
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
const emits = defineEmits(['closeModal'])
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
const getIsSending = (val) => {
  isSending.value = val
}
const onClose = () => {
  emits('closeModal')
}
</script>

<template>
  <IntelligentAssistant :showActiveMan="isSending" />
  <div class="interaction-container" ref="videoContainer">

    <Chat class="chat-position" @on-show-modal="onShow" @on-close-modal="onClose" @getIsSending="getIsSending" />
    <ViewModal v-model:show="show" :data="modalData" @on-click-scale="hanldeScale" class="view-modal-position"
      :style="viewModalHeight" />
  </div>
</template>

<style scoped>
.interaction-container {
  width: 100%;
  height: 74%;
  position: relative;
  overflow: hidden;
  /* background-color: white; */
}

.chat-position {
  /* position: absolute; */
  /* bottom: 10px; */
  /* left: 2%; */
}

.view-modal-position {
  position: absolute;
  top: 10%;
  right: 40px;
  border-radius: 4px;
  transition: all 0.3s;
}
</style>
