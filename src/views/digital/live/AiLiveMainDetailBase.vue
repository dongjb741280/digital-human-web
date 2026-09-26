<template>
  <el-form
    ref="formRef"
    :rules="formData"
    label-width="100px"
    v-loading="formLoading"
  >
    <el-form-item label="直播ID" prop="id">
        <el-input :value="formData.id" placeholder="直播ID" disabled />
    </el-form-item>
    <el-form-item label="直播名称" prop="liveName">
      <el-input :value="formData.liveName" placeholder="直播名称" disabled />
    </el-form-item>
    <el-form-item label="直播时间" prop="liveTime">
      <el-date-picker
        v-model="formData.liveTime"
        type="datetime"
        value-format="x"
        placeholder="直播时间"
        disabled
      />
    </el-form-item>
    <el-form-item label="直播分类" prop="liveType">
      <el-select v-model="formData.liveType" placeholder="直播分类" disabled>
        <el-option
          v-for="dict in getStrDictOptions(DICT_TYPE.LIVE_TYPE)"
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
    <!-- <el-form-item label="直播封面" prop="liveCover">
      <el-image :src="formData.liveCover" alt="human" class="w-180px h-180px" fit="contain" />
    </el-form-item> -->
    <el-form-item label="直播简介" prop="liveDesc">
      <el-input v-model="formData.liveDesc" placeholder="直播简介" type="textarea" :rows="4" maxlength="500" show-word-limit disabled/>
    </el-form-item>
    <!-- <el-form-item label="PPT名称" prop="copywriteId">
      <div class="flex items-center gap-2">
        <el-input v-model="formData.copywriteName" />
        <el-button type="primary" size="small" @click="onDownload({ id: formData.copywriteId})">下载PPT</el-button>
      </div>
    </el-form-item> -->
  </el-form>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { downloadPPT, getTextManageDetail } from "@/api/digital";
import download from '@/utils/download'

/** 数字人直播管理主 表单 */
defineOptions({ name: 'AiLiveMainDetailBase' })

const props = defineProps(['aiLiveMainVO'])
const { aiLiveMainVO } = toRefs(props);

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref({
  id: undefined,
  liveName: undefined,
  liveTime: undefined,
  liveType: undefined,
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
    if (aiLiveMainVO?.value) {
        formData.value = JSON.parse(aiLiveMainVO.value)
    }

    // getTextDetail(formData.value.copywriteId)
})

const onDownload = (item: any) => {
  downloadPPT({ id: item.id }).then((resp) => {
    download.pptx(resp, item.recordDesc)
  })
}

</script>
