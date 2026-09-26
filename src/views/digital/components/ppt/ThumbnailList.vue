<script setup lang="ts">
import { getPPTThumbnailList } from '@/api/digital'
defineOptions({
  name: 'ThumbnailList'
})
export interface ThumbnailItem {
  id: number
  url: string
  desc: string
  voiceUrl: string
}
const emit = defineEmits<{
  (event: 'on-item-click', item: ThumbnailItem): void
}>()

const props = defineProps<{
  copywriteId: string
}>()

watch(
  () => props.copywriteId,
  () => {
    getThumbnails()
  }
)

onMounted(() => {
  getThumbnails()
})

const getThumbnails = async () => {
  console.log('props.copywriteId', props.copywriteId)
  try {
    const res = await getPPTThumbnailList({ pptId: props.copywriteId })
    console.log('获取缩略图结果:', res)
    if (res) {
      // console.log('res.data', res.data)
      thumbnails.value = res.map((item: any) => ({
        id: item.ppt_num,
        url: item.ppt_image_url,
        desc: item.ppt_image_words,
        voiceUrl: item.ppt_voice_url
      }))
      console.log('thumbnails', thumbnails.value)
    }
  } catch (error) {
    console.error('获取缩略图失败:', error)
  }
}

const thumbnails = ref<ThumbnailItem[]>()

const selectedThumbnail = ref<number | null>(null)

const selectThumbnail = (item: ThumbnailItem) => {
  selectedThumbnail.value = item.id
  emit('on-item-click', item)
}
</script>

<template>
  <div
    class="flex flex-col gap-1 w-full p-2 mt-2 bg-white overflow-hidden overflow-y-auto h-[calc(100vh-400px)] custom-scroll-bar rounded-2 box-border"
  >
    <div v-for="(item, index) in thumbnails" :key="item.id" class="flex items-center mb-2">
      <span class="mr-2 text-sm text-gray-500">{{ index + 1 }}</span>
      <div
        class="cursor-pointer border border-solid border-transparent duration-300 ease-in-out flex-grow rounded-2 overflow-hidden"
        :class="{ '!border-#409eff': selectedThumbnail === item.id }"
        @click="selectThumbnail(item)"
      >
        <img
          :src="item.url"
          :alt="`缩略图 ${item.id}`"
          class="w-full h-100px block"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.custom-scroll-bar::-webkit-scrollbar {
  display: none;
}

.custom-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
