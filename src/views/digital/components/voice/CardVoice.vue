<!--卡片声音-->
<script lang="ts" setup>
import IconAvatar from '@/assets/imgs/default-avatar.png'
import IconWoman from '@/assets/imgs/default-avatar-w.png'

import { MoreView } from '../'
import { VoiceModal } from './'
import { ElMessage, ElMessageBox } from 'element-plus'
import { voiceDel } from '@/api/ai/voice'

const { t } = useI18n()

defineOptions({
  name: 'CardVoice'
})
const emit = defineEmits(['refresh'])
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
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const getStatusText = computed(() => {
  switch (props.data.voiceStatus) {
    case '1':
      return '执行中'
    case '2':
      return '执行中'
    case '3':
      return '执行失败'
    case '4':
      return '执行成功'
    default:
      return ''
  }
})

const getStatusStyle = computed(() => {
  switch (props.data.voiceStatus) {
    case '1':
      return 'text-#999999'
    case '2':
      return 'text-#ff8c00' // 橙色
    case '3':
      return 'text-#ff0000' // 红色
    case '4':
      return 'text-#008000' // 绿色
    default:
      return ''
  }
})

const getIsVisible = computed(() => {
  return props.data.voiceStatus === '4'
})

const isSelected = computed(() => {
  return props.selectId === props.data.id
})

// 使用计算属性来动态获取图标URL
const iconUrl = computed(() => {
  switch (props.data.voiceSex) {
    case '0':
      return IconAvatar
    case '1':
      return IconWoman
    default:
      return IconAvatar
  }
})

// // 后端接口路径
// const backendApiPath = `${import.meta.env.VITE_BASE_URL}/digital-api/system/voiceManager/voiceSample3`;

// // 计算完整的 URL
// const fullAudioUrl = computed(() => {
//   return `${backendApiPath}?voiceSampleUrl=${encodeURIComponent(props.data.voiceSampleUrl)}`;
// });

const moreData = [
  {
    name: '删除',
    icon: 'system-uicons:trash',
    onClick: () => {
      ElMessageBox.confirm(t('common.delMessage'), t('common.confirmTitle'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await voiceDel({ id: props.data.id })
        emit('refresh')
        ElMessage.success(t('common.delSuccess'))
      })
    }
  }
  /*{
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
    }voiceLabel
  }*/
]
</script>

<template>
  <div
    class="relative flex items-center gap-2 bg-white border border-solid border-gray-100 p-4 rounded-2 shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg"
    :class="isSelected ? '!border-#409eff' : ''"
  >
    <el-image :src="iconUrl" class="w-25%" />
    <div class="flex flex-col gap-2">
      <div class="text-#666666 truncate w-full">{{ data.voiceName }}</div>
      <div class="flex gap-2">
        <el-tag v-for="(label, index) in data.voiceLabel?.split(',') ?? []" :key="index">{{
          label.trim()
        }}</el-tag>
      </div>
    </div>
    <div v-if="more" class="absolute right-5px bottom-5px">
      <MoreView :data="moreData" />
    </div>
    <div v-if="getIsVisible" class="absolute right-8px top-8px">
      <VoiceModal :url="data.voiceSampleUrl" />
    </div>
    <div v-if="!getIsVisible" class="absolute right-10px top-10px">
      <span :class="[getStatusStyle, 'text-sm']">{{ getStatusText }}</span>
    </div>
  </div>
</template>

<style scoped>
.text-sm {
  font-size: 12px;
}
</style>
