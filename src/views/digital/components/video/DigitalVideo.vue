<!--数字人视频-->
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { useUserStore } from '@/store/modules/user'
import { getVideoList } from "@/api/digital";

import CardVideo from "./CardVideo.vue";
  defineOptions({
    name: 'DigitalVideo'
  })
  const porps = defineProps({
    type: {
      type: String,
      default: '0'  // 0 我的  1： 公共
    },
    cardType: {
      type: String,
      default: '1' // 1: 视频 2: 卡片
    },
    videoSave: {
      type: String,
      default: '' //1成品/ 0草稿 null: 全部
    },
    pagination: {
      type: Boolean,
      default: false
    }
  })
  const pageParams = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
})
  const loading = ref(false)
  const data = ref<Array<any>>([])
  let pollTimer: any = null

  const fetchList = async (silent = false) => {
    const { type, cardType, videoSave } = porps
    if (!silent) loading.value = true
    try {
      const resp = await getVideoList({ type, cardType, videoSave, ...pageParams })
      const prev = new Map((data.value || []).map((d: any) => [d.id, d.videoStatus]))
      data.value = resp.data
      pageParams.total = resp.total

      // 轮询时检测「执行中 -> 成功/失败」，给用户提示
      if (silent) {
        ;(resp.data || []).forEach((item: any) => {
          const before = prev.get(item.id)
          if (before === '2' && item.videoStatus === '4') {
            ElMessage.success(`视频「${item.videoName}」制作完成`)
          } else if (before === '2' && item.videoStatus === '3') {
            ElMessage.error(`视频「${item.videoName}」制作失败`)
          }
        })
      }

      // 还有执行中的视频就继续轮询，否则停止
      const hasRunning = (data.value || []).some((item: any) => item.videoStatus === '2')
      if (hasRunning && !pollTimer) {
        pollTimer = setInterval(() => fetchList(true), 5000)
      } else if (!hasRunning && pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
      }
    } catch (error) {
      // 静默轮询失败不提示
    } finally {
      if (!silent) loading.value = false
    }
  }

  const query = debounce(() => fetchList(false), 1000)
  // 监听
  watch(
    () => porps,
    (newVal, oldVal) => {
      query()
    },
    { deep: true, immediate: true }
)

onBeforeUnmount(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})
</script>

<template>
  <div v-loading="loading">
    <div class="flex flex-wrap gap-5 w-full mt-2" v-if="data.length>0">
      <CardVideo v-for="(item,index) in data" :type="type" :cardType="cardType" :key="index" :data="item" @refresh="query"/>
      <!-- 分页 -->
    <Pagination
     v-if="pagination"
     class="w-full justify-end"
        :total="pageParams.total"
        v-model:page="pageParams.pageNum"
        v-model:limit="pageParams.pageSize"
        @pagination="query"
      />
    </div>
  <el-empty class="h-150px" :image-size="50" description="暂无数据" v-else/>
  </div>

</template>
