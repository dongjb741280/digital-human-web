<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="直播名称" prop="liveName">
        <el-input
          v-model="queryParams.liveName"
          placeholder="请输入直播名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="直播时间" prop="liveTime">
        <el-date-picker
          v-model="queryParams.liveTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="系统归属" prop="systemType">
        <el-select
          v-model="queryParams.systemType"
          placeholder="请选择系统归属"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="地市归属" prop="eparchyCode">-->
<!--        <el-select-->
<!--          v-model="queryParams.eparchyCode"-->
<!--          placeholder="请选择地市归属"-->
<!--          clearable-->
<!--          class="!w-240px"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dict in getStrDictOptions(DICT_TYPE.EPARCHY_CODE)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="直播状态" prop="liveState">
        <el-select
          v-model="queryParams.liveState"
          placeholder="请选择直播状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.LIVE_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态" prop="watchState">
        <el-select
          v-model="queryParams.watchState"
          placeholder="请选择上架状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WATCH_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['digital:ai-live-main:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 创建直播
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['digital:ai-live-main:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column fixed label="主键ID" align="center" prop="id" /> -->
      <el-table-column fixed label="直播名称" align="center" prop="liveName" width="200px"/>
      <el-table-column
        label="直播时间"
        align="center"
        prop="liveTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="直播分类" align="center" prop="liveType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.LIVE_TYPE" :value="scope.row.liveType" />
        </template>
      </el-table-column>
      <el-table-column label="系统归属" align="center" prop="systemType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_TYPE" :value="scope.row.systemType" />
        </template>
      </el-table-column>
<!--      <el-table-column label="直播简介" align="center" prop="liveDesc" />-->
      <el-table-column label="地市归属" align="center" prop="eparchyCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.EPARCHY_CODE" :value="scope.row.reserve1" />
        </template>
      </el-table-column>
      <el-table-column label="制作状态" align="center" prop="videoStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.VIDEO_STATUS" :value="scope.row.videoStatus" />
        </template>
      </el-table-column>
      <el-table-column label="直播状态" align="center" prop="liveState">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.LIVE_STATE" :value="scope.row.liveState" />
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center" prop="watchState">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WATCH_STATE" :value="scope.row.watchState" />
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="creator" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!-- <el-table-column label="更新者" align="center" prop="updater" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column fixed="right" label="操作" align="center" min-width="240px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handlePutOn(scope.row)"
            v-hasPermi="['digital:ai-live-main:update']"
          >
            {{ scope.row.watchState === '0' ? '上架' : '下架' }}
          </el-button>
          <el-button
            link
            type="primary"
            @click="openstepsForm(scope.row)"
            v-hasPermi="['digital:ai-live-main:update']"
          >
            详情
          </el-button>
          <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['digital:ai-live-main:update']"
          >
            编辑
          </el-button> -->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['digital:ai-live-main:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AiLiveMainForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AiLiveMainApi, AiLiveMainVO } from '@/api/digital/live'
import AiLiveMainForm from './AiLiveMainForm.vue'

/** 数字人直播管理主 列表 */
defineOptions({ name: 'AiLiveMain' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AiLiveMainVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  liveName: undefined,
  liveTime: [],
  systemType: undefined,
  eparchyCode: undefined,
  liveState: undefined,
  watchState: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const router = useRouter(); // 路由实例

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AiLiveMainApi.getAiLiveMainPage(queryParams)
    list.value = data.list
    list.value = list.value.map(item => ({
      ...item,
      videoStatus: item.videoStatus || '3'
    }))
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()

const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const openstepsForm = (aiLiveMainVO: AiLiveMainVO) => {
  router.push({
    name: 'aiLiveMainDetail',
    query: {
      aiLiveMainVO: JSON.stringify(aiLiveMainVO),
      id: aiLiveMainVO.id,
      videoId: aiLiveMainVO.videoId
    }
  })
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AiLiveMainApi.deleteAiLiveMain(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await AiLiveMainApi.exportAiLiveMain(queryParams)
    download.excel(data, '数字人直播管理主.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 直播上架下架处理 */
const handlePutOn = async (vo: AiLiveMainVO) => {
  try {
    console.log(vo)
    if (vo.videoStatus != "4") {
      message.warning("当前视频状态无法上架")
      return
    }
    const data = {...vo,watchState: vo.watchState == "1" ? "0" : "1"} as unknown as AiLiveMainVO
    await AiLiveMainApi.updateAiLiveMain(data)
    message.success(t('common.updateSuccess'))
  } catch {
  } finally {
    await getList()
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>