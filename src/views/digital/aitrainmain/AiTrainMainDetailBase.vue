<template>
  <el-form
    ref="formRef"
    :rules="formData"
    label-width="100px"
    v-loading="formLoading"
  >
    <el-form-item label="课程ID" prop="id">
      <el-input :value="formData.id" placeholder="课程ID" disabled/>
    </el-form-item>
    <el-form-item label="课程名称" prop="trainName">
      <el-input :value="formData.trainName" placeholder="课程名称" disabled/>
    </el-form-item>

    <el-form-item label="课程分类" prop="trainType">
      <el-select v-model="formData.trainType" placeholder="课程分类" disabled>
        <el-option
          v-for="dict in getStrDictOptions(DICT_TYPE.TRAIN_TYPE)"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="系统归属" prop="systemType">
      <el-select v-model="formData.systemType" placeholder="系统归属" disabled>
        <el-option
          v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_TYPE)"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="视频封面" prop="liveCover">
      <el-image :src="formData.liveCover" alt="human" class="w-180px h-180px" fit="contain" />
    </el-form-item> -->
    <el-form-item label="课程简介" prop="liveDesc">
      <el-input v-model="formData.liveDesc" placeholder="课程简介" type="textarea" :rows="4" maxlength="500" show-word-limit disabled/>
    </el-form-item>
    <!-- 先将ppt名称注释-->
    <el-form-item label="PPT名称" prop="copywriteId" v-show="false">
      <div class="flex items-center gap-2">
        <el-input v-model="formData.copywriteName" disabled/>
        <!-- <el-input v-model="detailData.copywriteName" /> -->
        <el-button type="primary" size="small" @click="onDownload({ id: formData.copywriteId})">下载PPT</el-button>
      </div>
    </el-form-item>
    
  </el-form>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { downloadPPT, getTextManageDetail } from "@/api/digital";
import download from '@/utils/download'

/** 数字人直播管理主 表单 */
defineOptions({ name: 'AiTrainMainDetailBase' })

const props = defineProps(['aiTrainMainVO'])
const { aiTrainMainVO } = toRefs(props);

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref({
  id: undefined,
  trainName: undefined,
  trainType: undefined,
  systemType: undefined,
  liveCover: undefined,
  liveDesc: undefined,
  copywriteId: undefined,
  copywriteName: undefined
})
const detailData = ref() // 详情数据
const loading = ref(true) // 列表的加载中

watch(detailData,()=>{
    formData.value.copywriteName = detailData.value.copywriteName
})

// 添加处理base64图像的计算属性
const formattedImageUrl = computed(() => {
  const base64Prefix = 'data:image/png;base64,'
  return formData.value.liveCover ? base64Prefix + formData.value.liveCover : ''
})

const getTextDetail = async (copywriteId: any) => {
  loading.value = true
  try {
    detailData.value = await getTextManageDetail({ id: copywriteId })
  } finally {
    loading.value = false
  }
}
/** 初始化 **/
onMounted(() => {
    // 确保数据存在再赋值
    if (aiTrainMainVO?.value) {
        formData.value = JSON.parse(aiTrainMainVO.value)
    }

    // getTextDetail(formData.value.copywriteId)
})

const onDownload = (item: any) => {
  downloadPPT({ id: item.id }).then((resp) => {
    download.pptx(resp, item.recordDesc)
  })
}

</script>
