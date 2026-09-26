<!-- 文案详情-编辑 -->
<script lang="ts" setup>
import { getTextManageDetailEdit } from "@/api/digital";
import { useUserStore } from '@/store/modules/user'
defineOptions({ name: 'TextDetailEdit' })
const userStore = useUserStore()
const emit = defineEmits(['success'])

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const rowItem = ref(null)
const formModel = reactive({
  copywriteContent: '',
  copywriteTitle: '',
})
/** 打开弹窗 */
const open = async (item: any) => {
  console.log(item);

  dialogVisible.value = true
  // 设置数据
  detailLoading.value = true
  rowItem.value = item
  formModel.copywriteContent = item.copywriteContent
  formModel.copywriteTitle = item.copywriteTitle

}

const logading = ref(false)
const onSubmit = async () => {
  try {
    logading.value = true
  const resp = await getTextManageDetailEdit({ ...formModel, id: rowItem.value.id, oprStaff: userStore.getUser.id })
  if (resp) {
    ElMessage.success('修改成功')
    logading.value = false
    dialogVisible.value = false
    emit('success')
  }
  else
    ElMessage.error(resp.msg)
  } catch (error) {
    logading.value = false
  }
  

}

const dynamicHeight = computed(() => {
  return document.documentElement.clientHeight - 200
})
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<template>
  <Dialog v-model="dialogVisible" width="70%" :max-height="600" :scroll="true" title="编辑">
    <div class="flex items-center color-#409eff mb-10px">
      <Icon :icon="'ic:sharp-turned-in'" />
      <span class="text-#666666 font-600 ">基本信息</span>
    </div>
    <el-form :model="formModel">
      <el-form-item prop="title" label="文案名称">
        <el-input v-model="formModel.copywriteTitle" />
      </el-form-item>
      <el-form-item prop="content" label="文案内容">
        <v-md-editor v-model="formModel.copywriteContent" mode="edit" :height="dynamicHeight" left-toolbar="undo redo h bold italic" right-toolbar="preview fullscreen"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onSubmit" :loading="logading">
        提交
      </el-button>
    </template>
  </Dialog>
</template>
