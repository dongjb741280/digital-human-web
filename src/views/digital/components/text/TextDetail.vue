<!-- 文案详情 -->
<script lang="ts" setup>
import { getTextManageDetail, getTextPPT, deleteTextPPT, uploadPPT, downloadPPT } from "@/api/digital";
import { useUserStore } from '@/store/modules/user'
import download from '@/utils/download'

defineOptions({ name: 'TextDetail' })
const { tableObject, tableMethods } = useTable({
  getListApi: (paramsObj) => {
    return getTextPPT({ id: itemId.value, ...paramsObj })
  }, // 分页接口
  delListApi: (id) => {
    return deleteTextPPT({id})
   }, // 删除接口
})
const message = useMessage()
const userStore = useUserStore()
const itemId = ref(null)
const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const detailData = ref() // 详情数据
// 获得表格的各种操作
const { getList } = tableMethods
const detailSchema = [{
  field: 'copywriteContent',
  label: '内容',
}, {
  field: 'copywriteTitle',
  label: '文案名称',
}]
/** 打开弹窗 */
const open = async (id: String) => {
  itemId.value= id
  dialogVisible.value = true
  // 设置数据
  detailLoading.value = true
  try {
    detailData.value = await getTextManageDetail({ id })
    detailData.value.copywriteContent = detailData.value.copywriteContent.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
    getList()
  } finally {
    detailLoading.value = false
  }
}
// 监听 dialogVisible.value
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    detailData.value = {}
  }
})
const tableColumns = reactive(
  [
    {
      label: '生成时间',
      field: 'oprTime'
    },
    {
      label: '附件名称',
      field: 'recordDesc'
    },
    {
      label: '附件格式',
      field: 'recordFormat'
    },
    {
      label: '文件大小',
      field: 'recordSize'
    },
    {
      label: '版本号',
      field: 'recordVersion'
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
const onChange = (file: any) => {
  console.log(file)
  if (file.status === 'ready') {
    const formData = new FormData()
    formData.append('id', String(itemId.value))
    formData.append('pptFIle', file.raw, file.name)
    formData.append('oprStaff', String(userStore.getUser.id))
    uploadPPT(formData).then((resp) => {
      if(resp)
        message.success('上传成功')
      getList()
    })
  }
}
const onDownload = (item: any) => {
  downloadPPT({ id: item.id }).then((resp) => {
    download.pptx(resp, item.recordDesc)
  })
}
/** 删除按钮操作 */
const handleDelete = (id: String) => {
  tableMethods.delList(id, false)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<template>
  <Dialog v-model="dialogVisible" width="70%" :max-height="600" :scroll="true" title="详情">
    
    <div class="flex items-center justify-between color-#409eff">
      <div>
        <Icon :icon="'ic:sharp-turned-in'" />
        <span class="text-#666666 font-600 ">文案PPT</span>
      </div>
      <el-upload ref="uploadRef" action="none" accept=".pptx, .ppt" :auto-upload="false" :show-file-list="false" :on-change="onChange">
        <template #trigger>
          <el-button type="primary" size="small" >上传PPT</el-button>
        </template>
      </el-upload>
    </div>
    <Table
      class="mt-10px"
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      border
      >
      <template #action="{ row }">
        <el-button link type="primary" @click="onDownload(row)">
          下载
        </el-button>
        <el-button link type="danger" @click="handleDelete(row.id)">
          删除
        </el-button>
      </template>
    </Table>
    <div class="flex items-center color-#409eff mt-10px">
      <Icon :icon="'ic:sharp-turned-in'" />
      <span class="text-#666666 font-600 ">基本信息</span>
    </div>
    <Descriptions :data="detailData" :schema="detailSchema" >
      <template #copywriteContent="{ row }">
        <MarkdownView class="left-text" :content="row.copywriteContent" />
      </template>
      </Descriptions>
  </Dialog>
</template>
<style lang="scss" scoped>
:deep(.v-descriptions-content .el-descriptions__cell){
  width: auto !important;
}
</style>
