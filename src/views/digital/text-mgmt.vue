<!--文案管理-->
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { TextDetail, TextDetailEdit } from './components'
import { getTextManageListPage, deleteTextManage } from "@/api/digital";
import { Search } from '@element-plus/icons-vue'
const { tableObject, tableMethods } = useTable({
  getListApi: (paramsObj) => {
    return getTextManageListPage({ publicLibType:radioValue.value, oprStaff: userStore.getUser.id, copywriteTitle:copywriteTitle.value, ...paramsObj })
  },
  delListApi: (id) => {
    return deleteTextManage({id})
   }, // 删除接口
})
const userStore = useUserStore()
const router = useRouter()
const detailRef = ref(null)
const editRef = ref(null)
const radioValue = ref('0') //
const tableColumns = reactive(
  [
    {
      label: '序号',
      type: "index",
      width: 80,
      align: 'center'
    },
    {
      label: '文案名称',
      field: 'copywriteTitle'
    },
    {
      label: '文案内容',
      field: 'copywriteContent',
    },
    {
      label: 'PPT附件',
      field: 'copywriteUrl'
    },
    {
      label: '提交日期',
      field: 'oprTime'
    },
    {
      label: '最后修改时间',
      field: 'oprTime'
    },
    {
      label: '操作',
      field: 'action',
    }
  ]
)

// 获得表格的各种操作
const { getList, setSearchParams } = tableMethods

/** 删除按钮操作 */
const handleDelete = (id: number) => {
  tableMethods.delList(id, false)
}

/** 详情操作 */
const handleDetail = (id: number) => {
  detailRef.value.open(id)
}

const openForm = (item: any) => {
  //
  editRef.value.open(item)
}

const goEditPpt = (item: any) => {
  router.push({ path: '/digital/ppt-collabora', query: { pptId: item.mainPptId } })
}

// 监听
watch(radioValue, (newVal) => {
  getList()
})

const onClick = () => {
  router.push({ path: '/digital/text-prod' })
}

const handleSuccess = () => {
  getList()
}

const copywriteTitle = ref('')
const onSearch = () => {
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center">
        <el-radio-group style="flex-wrap: nowrap;" v-model="radioValue">
          <el-radio value="0" border>我的文案</el-radio>
          <el-radio value="1" border>公共库</el-radio>
        </el-radio-group>
        <el-input class="ml-20px" v-model="copywriteTitle" placeholder="请输入文案标题搜索" clearable @clear="onSearch">
      <template #append>
        <el-button :icon="Search"  @click="onSearch"/>
      </template>
      </el-input>
      </div>
        <el-button size="small" type="primary" @click="onClick">立即制作</el-button>
    </div>

    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :showOverflowTooltip="false"
      :pagination="{ total: tableObject.total }"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage">
      <template #action="{ row }">
        <el-button link type="primary" @click="openForm(row)">
          编辑
        </el-button>
        <el-button v-if="row.mainPptId" link type="primary" @click="goEditPpt(row)">
          编辑PPT
        </el-button>
        <el-button link type="primary" @click="handleDetail(row.id)">
          详情
        </el-button>
        <el-button link type="danger" @click="handleDelete(row.id)">
          删除
        </el-button>
      </template>
      <template #append></template>
    </Table>
    <TextDetail ref="detailRef" />
    <TextDetailEdit ref="editRef" @success="handleSuccess" />
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-radio__inner){
    display: none;
}
:deep(.el-table .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
