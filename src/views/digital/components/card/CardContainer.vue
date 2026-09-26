<!--卡片数字人-->
<script lang="ts" setup>
import {CardView} from './'
import * as DigitalPersonApi from "@/api/ai/digitalPerson";
import {DigitalPersonVO} from "@/api/ai/digitalPerson";
import {ref} from "vue";

defineOptions({
  name: 'CardContainer'
})

/** 初始化 **/
onMounted(() => {
  getDigitalPersonPage()
})


const digitalPersonList = ref<DigitalPersonVO[]>([]) // 列表的数据
const data = ref([])
const total = ref(0) // 列表的总页数
const emit = defineEmits(['onClick'])
const porps = defineProps({
  className: {
    type: [String, Object, Array],
    default: 'w-160px h-180px'
  },
  align: {
    type: String,
    values: ['left', 'right', 'center'],
    default: 'left'
  },
  type: {
    type: String,
    default: '' // 是否分享加入公共库 1：是，0：否
  },
  id: {
    type: String,
    default: '-1'
  },
  pagination: {
    type: Boolean,
    default: false
  },
  more: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: '' // null 查询所有 1: 3:失败 4:成功
  },
})
watch(() => porps.id, (newVal) => {
  selectId.value = newVal
})
const selectId = ref(porps.id)
const loading = ref(false)

const alignClass = computed(() => {
  return {
    'justify-start': porps.align === 'left',
    'justify-right': porps.align === 'right',
    'justify-center': porps.align === 'center'
  }
})

const onItemClick = (item: any) => {
  selectId.value = item.id
  item.humanId = item.id
  emit('onClick', item)
}

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  queryType: '0'
})

let pollTimer: any = null

/** 查询列表 */
const getDigitalPersonPage = async () => {
  loading.value = true
  try {
    console.log('getDigitalPersonPage queryParams', queryParams)
    queryParams.queryType = porps.type
    if (porps.status) {
      queryParams.status = porps.status
    }
    const data = await DigitalPersonApi.getAiDhHumanPage(queryParams)
    console.log('getDigitalPersonPage data', data)
    digitalPersonList.value = data.list
    total.value = data.total
    schedulePoll()
  } finally {
    loading.value = false
  }
}

/** 列表中存在「执行中(1/2)」的形象时，定时轮询刷新状态 */
const schedulePoll = () => {
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
  const hasInProgress = digitalPersonList.value.some((v) => v.humanStatus === '1' || v.humanStatus === '2')
  if (hasInProgress) {
    pollTimer = setTimeout(() => {
      getDigitalPersonPage()
    }, 5000)
  }
}

onBeforeUnmount(() => {
  if (pollTimer) {
    clearTimeout(pollTimer)
  }
})

</script>

<template>
  <div v-loading="loading">
    <div
      v-if="digitalPersonList.length>0" class="flex flex-wrap gap-5 mt-10px content-start"
      :class="alignClass">
      <CardView
        :class="className"
        :card-class="className"
        v-for="(item, index) in digitalPersonList"
        :data="item" :key="index"
        @click="onItemClick(item)"
        :select-id="selectId"
        :more="more"
        @refresh="getDigitalPersonPage"/>
      <!-- 分页 -->
      <Pagination
        v-if="pagination"
        class="w-full justify-end"
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getDigitalPersonPage"
      />
    </div>
    <el-empty class="h-150px" :image-size="50" description="暂无数据" v-else/>
  </div>
</template>
