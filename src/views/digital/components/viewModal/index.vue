<!---->
<script lang="ts" setup>
import { ImageView, VideoView, FormView, IFrame } from './plugins'
defineOptions({
  name: 'ViewModal'
})
export type Plugins = {
  type: string // 1 图片， 2 视频  form: 表单,  3 iframe: 外链
  data: any
}
const rendererMap = {
  1: ImageView,
  2: VideoView,
  form: FormView,
  iframe: IFrame
}
const porps = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        type: '1',
        data: {}
      }
    }
  },
  show: {
    type: Boolean,
    default: false
  }
})
const currentRenderer = computed(() => {
  return markRaw(rendererMap[porps.data.type])
})

const emit = defineEmits(['update:show', 'onClickScale'])
const dialogVisible = ref<boolean>(false)

watch(
  () => porps.show,
  (val) => {
    dialogVisible.value = val
  },
  {
    immediate: true
  }
)
const hanldeScale = () => {
  emit('onClickScale')
}
watch(dialogVisible, (val) => {
  emit('update:show', val)
})
</script>

<template>
  <div id="view-modal" v-if="dialogVisible" class="w-full z-999">
    <div class="relative w-full">
      <div class="absolute right-0 top-0 text-white text-2xl cursor-pointer z-999">
        <Icon
          icon="hugeicons:search-area"
          :size="20"
          class="mr-2 bg-dark opacity-80"
          @click="hanldeScale"
        />
        <Icon
          icon="ep:close"
          @click="dialogVisible = false"
          :size="20"
          class="bg-dark opacity-80"
        />
      </div>
      <component :is="currentRenderer" :data="data.data" @close="dialogVisible = false" />
    </div>
  </div>
</template>
