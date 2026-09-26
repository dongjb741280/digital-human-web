<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="直播ID" align="center" prop="liveId" /> -->
      <el-table-column label="用户工号" align="center" prop="staffId" />
      <el-table-column label="用户姓名" align="center" prop="staffName" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="观看类型" align="center" prop="viewType" />
      <el-table-column label="观看时长" align="center" prop="viewDuration" />
      <!-- <el-table-column label="备注说明" align="center" prop="remark" />
      <el-table-column label="预留字段1" align="center" prop="reserve1" />
      <el-table-column label="预留字段2" align="center" prop="reserve2" />
      <el-table-column label="预留字段3" align="center" prop="reserve3" />
      <el-table-column label="预留字段4" align="center" prop="reserve4" />
      <el-table-column label="预留字段5" align="center" prop="reserve5" /> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { AiLiveWatchHistoryApi, AiLiveWatchHistoryVO } from '@/api/digital/live/watchHistory'

/** 数字人直播观看记录 列表 */
defineOptions({ name: 'AiLiveWatchHistory' })
const props = defineProps(['liveId'])
const { liveId } = toRefs(props);

const loading = ref(true) // 列表的加载中
const list = ref<AiLiveWatchHistoryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  liveId: liveId?.value,
  staffId: undefined,
  viewType: undefined,
  viewDuration: undefined,
  remark: undefined,
  reserve1: undefined,
  reserve2: undefined,
  reserve3: undefined,
  reserve4: undefined,
  reserve5: undefined,
  createTime: []
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AiLiveWatchHistoryApi.getAiLiveWatchHistoryPage({liveId: liveId?.value})
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}


/** 初始化 **/
onMounted(() => {
  getList()
})
</script>