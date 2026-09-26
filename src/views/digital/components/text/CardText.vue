<!-- 文本卡片-->
<script lang="ts" setup>
import IconAvatar from '@/assets/imgs/default-avatar.png'
import { MoreView } from '../'
defineOptions({
  name: 'CardText'
})
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  more: {
    type: Boolean,
    default: false
  },
  selectId: {
    type: String,
    default: '-1'
  }
})
const isSelected = computed(() => {
  return props.selectId === props.data.id
})
const moreData = [
  {
    name: '删除',
    icon: 'system-uicons:trash',
    click: () => {
      console.log('删除');
    }
  },
  {
    name: '编辑',
    icon: 'system-uicons:create',
    click: () => {
      console.log('编辑');
    }
  },
  {
    name: '重命名',
    icon: 'system-uicons:pen',
    click: () => {
      console.log('重命名');
    }
  },
  {
    name: '创建副本',
    icon: 'system-uicons:clipboard-copy',
    click: () => {
      console.log('创建副本');
    }
  }
]
</script>

<template>
  <div class="relative flex items-center gap-4 bg-white border border-solid border-gray-100 p-2 rounded-2 shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg shrink-0 align-content" :class="isSelected? '!border-#409eff': ''">
    <!-- <el-image :src="IconAvatar" class="w-60px h-60px"/> -->
    <div class="flex items-center justify-center w-40px h-40px bg-#F3FAFD rounded-2">
      <Icon icon="system-uicons:document" :size="50" color="#999999" />
    </div>
    <div class="flex flex-col gap-2 w-full overflow-hidden">
      <div class="text-#666666 text-14px">{{ data.copywriteTitle }}</div>
      <div class="w-auto pr-5px">
        <div class="text-#999999 text-12px">文案提纲</div>
        <div class="text-#999999 text-12px truncate">{{ data.copywriteContent }}</div>
      </div>
    </div>
    <div v-if="more" class="absolute right-5px bottom-5px">
      <MoreView :data="moreData" />
    </div>
  </div>
</template>

