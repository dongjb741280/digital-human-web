<!--数字人卡片-->
<script lang="ts" setup>
import { MoreView } from '../'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as DigitalPersonApi from '@/api/ai/digitalPerson'
import { useRouter } from 'vue-router'

const { t } = useI18n()
defineOptions({
  name: 'CardView'
})
const emit = defineEmits(['refresh'])
const router = useRouter()
const props = defineProps({
  onCreateClick: {
    type: Function,
    default: null // 如果父组件没有提供函数，默认为null
  },
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
  showAction: {
    type: Boolean,
    default: false
  },
  selectId: {
    type: String,
    default: '-1'
  },
  cardClass: {
    type: [String, Object, Array],
    default: 'w-full h-180px'
  }
})

const getStatusStyle = computed(() => {
  switch (props.data.humanStatus) {
    case '1':
      return 'text-#ff8c00'
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

const getStatusText = computed(() => {
  switch (props.data.humanStatus) {
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

const isSelected = computed(() => {
  return props.selectId === props.data.id
})

// 添加处理base64图像的计算属性
const formattedImageUrl = computed(() => {
  const base64Prefix = 'data:image/png;base64,'
  return props.data.humanImageUrl ? base64Prefix + props.data.humanImageUrl : ''
})

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
        await DigitalPersonApi.deleteDigitalPerson(props.data.id)
        emit('refresh')
        ElMessage.success(t('common.delSuccess'))
      })
    }
  },
  {
    name: '编辑',
    icon: 'system-uicons:create',
    onClick: () => {
      console.log('编辑')
      router.push({
        path: '/digital/CreateDigitalAvatar',
        query: { id: props.data.id, isNew: 'false' }
      })
    }
  }
  /*{
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
  }*/
]
</script>

<template>
  <div
    class="relative w-160px h-auto bg-white border border-solid border-gray-100 rounded-2 shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg overflow-hidden"
    :class="isSelected ? '!border-#409eff' : 'border-gray-100'"
  >
    <span
      v-if="showAction"
      @click="onCreateClick"
      class="text-#409eff border-solid border border-#f2f2f2 bg-#f0f7ff rounded-1 text-size-12px pl-5px pr-5px absolute right-5px top-5px z-10 cursor-pointer"
      >创作></span
    >
    <el-image :src="data.humanImageUrl" alt="human" :class="cardClass" fit="contain" />
    <div class="flex justify-between items-center h-30px">
      <div class="flex-1 text-center text-#666666 text-size-14px">{{ data.humanName }}</div>
      <MoreView v-if="more" :data="moreData" />
    </div>
    <div
      v-if="data.humanStatus !== '4'"
      class="absolute top-3px left-3px border border-solid border-gray-200 rounded-2px text-red text-size-10px w-fit pl-5px pr-5px"
    >
      <span :class="[getStatusStyle, 'text-sm']">{{ getStatusText }}</span>
    </div>
  </div>
</template>

<style scoped>
.text-sm {
  font-size: 12px;
}
</style>
