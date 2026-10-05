<!--图层容器-->
<script lang="ts" setup>
import type { Layer, layerType } from './type'
import {
  Picture,
  Delete,
  Files,
  PictureFilled,
  VideoPlay,
  Avatar,
  Tickets,
  Lock,
  Microphone
} from '@element-plus/icons-vue'
defineOptions({
  name: 'LayersBox'
})
const emit = defineEmits(['onItemClick', 'onItemDel', 'update:layers', 'change', 'onVoiceDel'])
const props = defineProps({
  layers: {
    type: Array<Layer>,
    default: () => []
  },
  voiceName: {
    type: String,
    default: ''
  }
})

const { layers } = toRefs(props)
const dragLayers = ref()
const layerBgView = ref<Layer>()
let dragIndex = 0
let dropIndex = 0

watch(
  () => layers.value,
  (newValue) => {
    layerBgView.value = newValue.find((item) => item.name === 'BackGround')
    dragLayers.value = [...newValue.filter((item) => item.name !== 'BackGround')]
  },
  {
    deep: true
  }
)

const dragstart = (e, index) => {
  e.stopPropagation()
  dragIndex = index
  dropIndex = index
  setTimeout(() => {
    e.target.classList.add('moveing')
  }, 0)
}
const dragenter = (e, index) => {
  e.preventDefault()
  // 拖拽到原位置时不触发
  if (dragIndex !== index) {
    const source = dragLayers.value[dragIndex]
    dragLayers.value.splice(dragIndex, 1)
    dragLayers.value.splice(index, 0, source)

    // 更新节点位置
    dragIndex = index
  }
}
const dragover = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}
const dragend = (e, index) => {
  e.target.classList.remove('moveing')
  emit('change', dropIndex, index)
  setTimeout(() => {
    const array: Layer[] = [...dragLayers.value]
    if (layerBgView.value) {
      array.unshift(layerBgView.value)
    }
    emit('update:layers', array)
  }, 0)
}
const handleClick = (item) => {
  emit('onItemClick', item)
}
const handleDelete = (item) => {
  emit('onItemDel', item)
  dragLayers.value.splice(dragLayers.value.indexOf(item), 1)
}
const handleVoiceDel = () => {
  emit('onVoiceDel')
}
const getLayerName = (type: layerType) => {
  if (type === 'Human') {
    return '数字人'
  }
  if (type === 'PPT') {
    return 'PPT'
  }
  if (type.includes('Image')) {
    return `图片`
  }
  if (type === 'BackGround') {
    return '背景'
  }
  if (type.includes('Video')) {
    return `视频`
  }
  return type
}
</script>

<template>
  <div class="w-full flex flex-col gap-10px p-2 mt-2 bg-white rounded-2 box-border">
    <div
      class="w-full h-[40px] line-height-40px color-coolGray text-size-18px flex items-center justify-between rounded-6px border border-solid border-coolGray-200 cursor-not-allowed"
      v-if="layerBgView"
    >
      <span class="flex items-center gap-10px ml-12px min-w-0 flex-1">
        <el-icon class="text-size-24px">
          <PictureFilled />
        </el-icon>
        <span class="text-size-16px select-none truncate">{{ getLayerName(layerBgView.name) }}{{ layerBgView.title ? `：${layerBgView.title}` : '' }}</span>
      </span>
      <span>
        <el-icon>
          <Lock />
        </el-icon>
        <el-icon @click="handleDelete(layerBgView)" class="mx-10px cursor-pointer">
          <Delete />
        </el-icon>
      </span>
    </div>
    <div
      class="w-full h-[40px] line-height-40px color-coolGray text-size-18px flex items-center justify-between rounded-6px border border-solid border-#409eff bg-#ecf5ff"
      v-if="voiceName"
    >
      <span class="flex items-center gap-10px ml-12px min-w-0">
        <el-icon class="text-size-24px">
          <Microphone />
        </el-icon>
        <span class="text-size-16px select-none truncate">声音：{{ voiceName }}</span>
      </span>
      <el-icon @click="handleVoiceDel" class="mr-10px cursor-pointer shrink-0">
        <Delete />
      </el-icon>
    </div>
    <TransitionGroup name="list" tag="div" class="w-full flex flex-col gap-10px">
      <div
        class="w-full h-[40px] line-height-40px color-coolGray text-size-18px flex items-center justify-between rounded-6px border border-solid border-coolGray-200"
        v-for="(item, i) in dragLayers"
        :key="item.id"
        draggable="true"
        @click="handleClick(item)"
        @dragstart="dragstart($event, i)"
        @dragenter="dragenter($event, i)"
        @dragend="dragend($event, i)"
        @dragover="dragover"
      >
        <span class="flex items-center gap-10px ml-12px min-w-0 flex-1">
          <el-icon class="text-size-24px">
            <Avatar v-if="item.name === 'Human'" />
            <Files v-if="item.name === 'PPT'" />
            <Tickets v-if="item.name === 'Text'" />
            <PictureFilled v-if="item.name === 'BackGround'" />
            <VideoPlay v-if="item.name.includes('Video')" />
            <Picture v-if="item.name.includes('Image')" />
          </el-icon>
          <span class="text-size-16px select-none truncate">{{ getLayerName(item.name) }}{{ item.title ? `：${item.title}` : '' }}</span>
        </span>
        <el-icon @click="handleDelete(item)" class="mr-10px cursor-pointer">
          <Delete />
        </el-icon>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.moveing {
  opacity: 0;
}
</style>
