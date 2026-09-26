<!--数字人声音容器-->
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import {CardVoice} from "./";
import {ref} from "vue";
import * as VoiceApi from '@/api/ai/voice';
import {VoiceVO} from "@/api/ai/voice";

/** 初始化 **/
onMounted(async () => {
  await getVoicePage()
})

const loading = ref(true) // 列表的加载中
const voiceList = ref<VoiceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 30,
  voiceShare: "0"
})

defineOptions({
  name: 'VoiceContainer'
})
const props = defineProps({
  className: {
    type: [String, Object, Array],
    default: () => {
      return {}
    }
  },
  align: {
    type: String,
    default: 'left'
  },
  id: {
    type: String,
    default: '-1'
  },
  status: {
    type: String,
    default: '' // null 查询所有 1: 3:失败 4:成功
  },
  pagination: {
    type: Boolean,
    default: false
  },
  voiceShare: {
    type: String,
    default: '0' // 0:我的克隆 1:公共库
  },
  more: {
    type: Boolean,
    default: false
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})
const selectId = ref(props.id)
const alignClass = computed(() => {
  return {
    'justify-start': props.align === 'left',
    'justify-right': props.align === 'right',
    'justify-center': props.align === 'center'
  }
})

const voiceName = ref('')

const onSearch = () => {
  queryParams.pageNum = 1
  getVoicePage()
}

let pollTimer: any = null

/** 查询列表 */
const getVoicePage = async () => {
  loading.value = true
  try {
    queryParams.voiceShare = props.voiceShare;
    const data = await VoiceApi.getVoicePage({ ...queryParams, voiceStatus: props.status, voiceName: voiceName.value })
    voiceList.value = data.data
    total.value = data.total
    schedulePoll()
  } finally {
    loading.value = false
  }
}

/** 列表中存在「执行中(1/2)」的声音时，定时轮询刷新状态 */
const schedulePoll = () => {
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
  const hasInProgress = voiceList.value.some((v) => v.voiceStatus === '1' || v.voiceStatus === '2')
  if (hasInProgress) {
    pollTimer = setTimeout(() => {
      getVoicePage()
    }, 5000)
  }
}

onBeforeUnmount(() => {
  if (pollTimer) {
    clearTimeout(pollTimer)
  }
})

const emit = defineEmits(['onClick'])
const onItemClick = (item: any) => {
  selectId.value = item.id
    item.voiceId = item.id
    emit('onClick',item)
  }
</script>

<template>

  <div v-loading="loading" :class="{ 'pt-10px': showSearch }">
    <div v-if="showSearch" class="w-full" :class="{ 'ml-300px mt--60px': !isMobile }">
        <el-input class="max-w-350px" v-model="voiceName" placeholder="请输入声音标题搜索" clearable @clear="onSearch">
          <template #append>
            <el-button :icon="Search"  @click="onSearch"/>
          </template>
        </el-input>
      </div>
    <div v-if="voiceList.length>0" class="flex flex-wrap gap-2xl mt-10px content-start" :class="alignClass">
      <CardVoice
        class="w-240px"
        :class="className"
        v-for="(item, index) in voiceList" :key="index"
        :data="item"
        @click="onItemClick(item)"
        :select-id="selectId"
        :more="more"
        @refresh="getVoicePage"/>

         <!-- 分页 -->
    <Pagination
     v-if="pagination"
     class="w-full justify-end"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getVoicePage"
      />
    </div>
    <el-empty class="h-150px" :image-size="50" description="暂无数据" v-else/>
  </div>
</template>

