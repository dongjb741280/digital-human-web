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
      <el-form-item label="课程名称" prop="trainName">
        <el-input
          v-model="queryParams.trainName"
          placeholder="请输入课程名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
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
      <el-form-item label="上架状态" prop="watchState">
        <el-select
          v-model="queryParams.watchState"
          placeholder="请选择上架状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TRAIN_WATCH_STATE)"
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
          v-hasPermi="['digital:ai-train-main:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 创建课程
        </el-button>

        <el-button
          type="primary"
          plain
          @click="openForm('createupload')"
          v-hasPermi="['digital:ai-train-main:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 上传课程
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['digital:ai-train-main:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 通过v-if=xxx将id控件隐藏 -->
      <el-table-column fixed label="主键ID" align="center" prop="id" v-if="false" />

      <el-table-column label="课程名称" align="center" prop="trainName"  width="200px" />
      <el-table-column label="课程简介" align="center" prop="liveDesc"  width="300px" />
      
      <el-table-column label="课程分类" align="center" prop="trainType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRAIN_TYPE" :value="scope.row.trainType" />
        </template>
      </el-table-column>
      
      <el-table-column label="系统归属" align="center" prop="systemType" width="130px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_TYPE" :value="scope.row.systemType" />
        </template>
      </el-table-column>
      <el-table-column label="地市归属" align="center" prop="eparchyCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.EPARCHY_CODE" :value="scope.row.reserve1" />
        </template>
      </el-table-column>
      <el-table-column label="视频状态" align="center" prop="videoStatus" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.VIDEO_STATUS" :value="scope.row.videoStatus" />
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center" prop="watchState" width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRAIN_WATCH_STATE" :value="scope.row.watchState" />
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
      <el-table-column label="操作" align="center" min-width="240px">
        <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    @click="handlePutOn(scope.row)"
                    v-hasPermi="['digital:ai-train-main:update']"
                  >
                     {{ scope.row.watchState === '0' || scope.row.watchState === '2' ? '上架' : '下架' }}
                  </el-button>
                  <el-button
                    link
                    type="primary"
                    @click="openstepsForm(scope.row)"
                    v-hasPermi="['digital:ai-train-main:update']"
                  >
                    详情
                  </el-button>
          <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['digital:ai-train-main:update']"
          >
            编辑
          </el-button> -->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['digital:ai-train-main:delete']"
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
  <AiTrainMainForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AiTrainMainApi, AiTrainMainVO } from '@/api/digital/aitrainmain'
import AiTrainMainForm from './AiTrainMainForm.vue'

/** 数字人课程管理 列表 */
defineOptions({ name: 'AiTrainMain' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AiTrainMainVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  trainName: undefined,
  createTime: [],
  systemType: undefined,
  eparchyCode: undefined,
  watchState: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const router = useRouter(); // 路由实例
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AiTrainMainApi.getAiTrainMainPage(queryParams)
    list.value = data.list
      list.value = list.value.map(item => ({
        ...item,
        videoStatus: item.videoStatus || (item.createType == "2" ? "4" : "3")
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
const openstepsForm = (aiTrainMainVO: AiTrainMainVO) => {
  router.push({
    name: 'aiTrainMainDetail',
    query: {
      aiTrainMainVO: JSON.stringify(aiTrainMainVO),
      id: aiTrainMainVO.id,
      videoId: aiTrainMainVO.videoId,
      createType: aiTrainMainVO.createType,
      videoUrl: aiTrainMainVO.videoUrl
    }
  })
}
/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AiTrainMainApi.deleteAiTrainMain(id)
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
    const data = await AiTrainMainApi.exportAiTrainMain(queryParams)
    download.excel(data, '数字人课程管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 直播上架下架处理 */
const handlePutOn = async (vo: AiTrainMainVO) => {
  try {
    // let data = {watchState: ！watchState}
    console.log(vo)
    if (vo.videoStatus != "4") {
      message.warning("当前视频状态无法上架")
      return
    }
    const data = {...vo,watchState: vo.watchState == "0" || vo.watchState == "2" ? "1" : "2"} as unknown as AiTrainMainVO
    debugger
    data.trainId=data.id
    await AiTrainMainApi.updateAiTrainMain(data)
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
