<!-- layerBox.vue -->
<script lang="ts" setup>
import { debounce } from 'lodash-es'

const props = defineProps({
  boxStyle: {
    type: Object,
    default: () => {
      return {
        width: '0',
        height: '0',
        left: '0',
        top: '0'
      }
    }
  }
})

console.log(props.boxStyle)

const clientRect = ref<DOMRect>()
clientRect.value = document.getElementById('canvas-box-wrapper')?.getBoundingClientRect()

const canvasLayerBox = ref<HTMLDivElement>()

const handleMouseMove = (e: MouseEvent) => {
  console.log('----------------------------')
  setCursor(e)
}
const { boxStyle } = toRefs(props)
const cleft = ref(0)
const ctop = ref(0)
const cwidth = ref(0)
const cheight = ref(0)
watchEffect(() => {
  cleft.value = parseFloat(boxStyle.value.left)
  ctop.value = parseFloat(boxStyle.value.top)
  cwidth.value = parseFloat(boxStyle.value.width)
  cheight.value = parseFloat(boxStyle.value.height)
})
const setCursor = debounce((e: MouseEvent) => {
  let rect = clientRect.value || { left: 0, top: 0 }
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top

  if (x >= cleft.value - 5 && x <= cleft.value + 6 && y >= ctop.value - 5 && y <= ctop.value + 6) {
    if (canvasLayerBox.value) canvasLayerBox.value.style.cursor = 'nwse-resize'
  } else if (
    (x >= cleft.value + cwidth.value - 5 &&
      x <= cleft.value + cwidth.value + 6 &&
      y >= ctop.value - 5 &&
      y <= ctop.value + 6) ||
    (x >= cleft.value - 5 &&
      x <= cleft.value + 6 &&
      y >= ctop.value + cheight.value - 5 &&
      y <= ctop.value + cheight.value + 6)
  ) {
    if (canvasLayerBox.value) canvasLayerBox.value.style.cursor = 'nesw-resize'
  } else if (
    x >= cleft.value + cwidth.value - 5 &&
    x <= cleft.value + cwidth.value + 6 &&
    y >= ctop.value + cheight.value - 5 &&
    y <= ctop.value + cheight.value + 6
  ) {
    if (canvasLayerBox.value) canvasLayerBox.value.style.cursor = 'nwse-resize'
  } else if (
    x >= cleft.value &&
    x <= cleft.value + cwidth.value &&
    y >= ctop.value &&
    y <= ctop.value + cheight.value
  ) {
    if (canvasLayerBox.value) canvasLayerBox.value.style.cursor = 'move'
  } else {
    if (canvasLayerBox.value) canvasLayerBox.value.style.cursor = 'default'
  }
}, 16)

onMounted(() => {
  nextTick(() => {
    canvasLayerBox.value?.addEventListener('mousemove', handleMouseMove)
  })
})
onBeforeUnmount(() => {
  canvasLayerBox.value?.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div
    ref="canvasLayerBox"
    :style="{
      width: boxStyle.width + 'px',
      height: boxStyle.height + 'px',
      top: boxStyle.top + 'px',
      left: boxStyle.left + 'px'
    }"
    class="absolute border-#ffc828 border-2px border-solid z-99 before-bg"
  ></div>
</template>

<style lang="scss" scoped>
.before-bg::before {
  content: '';
  display: block;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  background:
    linear-gradient(to left, #ffc828, #ffc828) left top no-repeat,
    linear-gradient(to bottom, #ffc828, #ffc828) left top no-repeat,
    linear-gradient(to left, #ffc828, #ffc828) right top no-repeat,
    linear-gradient(to bottom, #ffc828, #ffc828) right top no-repeat,
    linear-gradient(to left, #ffc828, #ffc828) left bottom no-repeat,
    linear-gradient(to bottom, #ffc828, #ffc828) left bottom no-repeat,
    linear-gradient(to left, #ffc828, #ffc828) right bottom no-repeat,
    linear-gradient(to left, #ffc828, #ffc828) right bottom no-repeat;
  // background-image: linear-gradient(to left, rgb(255, 200, 40), rgb(255, 200, 40)),
  //   linear-gradient(rgb(255, 200, 40), rgb(255, 200, 40)),
  //   linear-gradient(to left, rgb(255, 200, 40), rgb(255, 200, 40)),
  //   linear-gradient(rgb(255, 200, 40), rgb(255, 200, 40)),
  //   linear-gradient(to left, rgb(255, 200, 40), rgb(255, 200, 40)),
  //   linear-gradient(rgb(255, 200, 40), rgb(255, 200, 40)),
  //   linear-gradient(to left, rgb(255, 200, 40), rgb(255, 200, 40)),
  //   linear-gradient(to left, rgb(255, 200, 40), rgb(255, 200, 40));
  background-size:
    10px 10px,
    10px 10px,
    10px 10px,
    10px 10px;
  transform: translate(-5px, -5px);
}
</style>
