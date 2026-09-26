<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" :width="1250" modal-append-to-body append-to-body :close-on-click-modal="false" @close="closeDialog">
    <div v-if=" formType != 'createupload' && formData.createType != '2' ">
    <el-steps :active="activeStep" finish-status="success" class="pb-8">
      <el-step title="基本信息"></el-step>
      <el-step title="文案编辑"></el-step>
      <el-step title="视频合成"></el-step>
    </el-steps>
    </div>
    <el-form
      v-if="activeStep === 0"
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
   <!--congjy输出变量的值00:{{trainName:名称16}}
   congjy输出变量createType的值:{{formData.createType}}-->
<!--    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
    -->
      <!-- <el-form-item label="课程ID" prop="trainId">
        <el-input v-model="formData.id" placeholder="请输入课程编码" disabled/> -->
        <!--<input type="hidden" id =trainId :value="formData.id">-->
        <input type="hidden" id ="trainId" v-model="formData.id">

      <!-- </el-form-item> -->
      <el-form-item label="课程名称" prop="trainName">
        <el-input v-model="formData.trainName" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="课程分类" prop="trainType">
        <el-select v-model="formData.trainType" placeholder="请选择课程分类">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TRAIN_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="系统归属" prop="systemType">
        <el-select v-model="formData.systemType" placeholder="请选择系统归属">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SYSTEM_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地市归属" prop="eparchyCode">
        <el-select v-model="formData.eparchyCode" placeholder="请选择地市归属">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.EPARCHY_CODE)" :key="dict.value" :label="dict.label"
                     :value="dict.value" />
        </el-select>
      </el-form-item>




<!-- 封面########################################################################################################################start -->
      <!-- 上传封面文件 -->
      <!-- 在模板中 -->
      <!-- <el-form-item label="封面文件" prop="phoneFIle">
        <label for="phoneFile"></label>
        <input
          type="file"
          id="phoneFIle"
          @change="handleFileChange"
        />

      </el-form-item> -->

<!-- 封面########################################################################################################################end -->


      <!-- <el-form-item label="视频封面" prop="liveCover">

      <el-upload class="avatar-uploader" accept="image/*" :auto-upload="false" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :on-change="handleUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
          <template #tip>
            <div class="！el-upload__tip text-red">
              只限1个文件 ，且不超过2MB, 图片格式为JPG
            </div>
          </template>
      </el-upload>

      </el-form-item> -->


      <el-form-item label="课程简介" prop="liveDesc">
        <el-input v-model="formData.liveDesc" placeholder="请输入课程简介" type="textarea" :rows="4" maxlength="500" show-word-limit />
      </el-form-item>

      <el-form-item label="创建类型" prop="createType" v-show="false">
        <el-select v-model="formData.createType" placeholder="请选择创建类型"  disabled>
                   <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.CREATE_TYPE)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
        </el-select>
      </el-form-item>


      <el-form-item label="课程状态" prop="state" v-if="false">
        <el-select v-model="formData.state" placeholder="请选择课程状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TRAINSTATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>


<!-- 视频########################################################################################################################start -->
      <!-- 上传视频文件 -->
      <!-- 在模板中 -->
      <div v-if=" formType === 'createupload' || formData.createType === '2'  ">
      <el-form-item label="视频文件" prop="videoFIle">
        <label for="videoFIle"></label>
        <input
          type="file"
          id="videoFIle"
          @change="handlevideoFileChange"
        />
      </el-form-item>

      <div style="height: 20px;"></div> <!-- 增加空行 -->
      </div>
<!-- 视频########################################################################################################################end -->



      <!--创建课程（上传）仅展示上传控件-->
      <!-- <div v-if=" formType === 'createupload' || formData.createType === '2' ">
        <el-form-item label="上传视频" prop="videoUrl">
        <el-upload class="avatar-uploader" accept="video/*" :auto-upload="false" :show-file-list="false"
          :before-upload="beforeAvatarUploadvideo" :on-change="handleUploadvideo">
            <video v-if="videoUrl" :src="videoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-iconvideo">
              <Plus />
            </el-icon>
            <template #tip>
              <div class="！el-upload__tip text-red">
                支持上传.mp4视频格式的文件
              </div>
            </template>
        </el-upload>


        </el-form-item>
      </div> -->
<!--
      <el-form-item label="视频时长（单位：秒）" prop="videoDuration">
        <el-input v-model="formData.videoDuration" placeholder="请输入视频时长（单位：秒）" />
      </el-form-item>
      -->
      <!--创建课程（非上传）需要展示比上传类多出的字段-->
      <!-- <div v-if=" formType === 'create' || formData.createType === '1' "> -->
        <!-- 一期项目暂时不展示这几个字段，但代码保留-->
        <div v-if=" formType === 'create_aaaaa' || formData.createType === '1_aaaaa' ">


      <el-form-item label="上传文件对应文案ID" prop="copywriteId">
        <el-input v-model="formData.copywriteId" placeholder="请输入上传文件对应文案ID" />
      </el-form-item>
      <el-form-item label="内容制作ID" prop="videoId">
        <el-input v-model="formData.videoId" placeholder="请输入内容制作ID" />
      </el-form-item>
      <el-form-item label="上传视频url地址" prop="videoUrl">
        <el-input v-model="formData.videoUrl" placeholder="请输入上传视频url地址" />
      </el-form-item>
      <el-form-item label="上下架状态" prop="watchState">
        <el-select v-model="formData.watchState" placeholder="请选择上下架状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TRAIN_WATCH_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="课程状态" prop="state">
        <el-select v-model="formData.state" placeholder="请选择课程状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.TRAINSTATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="备注说明" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注说明" />
      </el-form-item>
    </div>

    </el-form>

    <div v-if="activeStep === 1">
      <textprod :info="formData" ref="textProd" @getpptInfo="getpptInfo"></textprod>
    </div>

    <div v-if="activeStep === 2">
      <!-- <VideoProd :info="formData"></VideoProd> -->
      <VideoProd ref="videoProd" :pptInfo="pptInfo"></VideoProd>
    </div>

    <template #footer>
      <!--<el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      -->
      <!--
      <div v-if=" formType === 'createupload' ">
        <el-button @click="prevStep" v-if="formType === 'createupload' ">上传</el-button>
      </div>
      -->

      <input type="hidden" id ="aa" v-model="formData.createType">
      <input type="hidden" id ="bb" v-model="formData.videoId">

      <el-button type="primary" @click="submitForm" v-if="formType === 'createupload' || formData.createType === '2' ">确 定</el-button>


<div v-if="formData.createType === '1' && (!formData.videoId || formData.videoId === '')">
  <!-- <el-button @click="prevStep" v-if="activeStep > 0">上一步</el-button> -->
  <el-button type="primary" @click="nextStep" v-if="activeStep < 2">下一步</el-button>
  <el-button type="success" @click="commitLiveVideo" v-if="activeStep === 2">提交</el-button>
</div>
<div v-else-if="formData.createType === '1' && formData.videoId !== null && formData.videoId !== ''">
  <el-button type="primary" @click="nextStep" v-if="activeStep < 2">确定</el-button>
  <el-button type="success" @click="commitLiveVideo" v-if="activeStep === 2">提交</el-button>
</div>
    </template>

  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { AiTrainMainApi, AiTrainMainVO } from '@/api/digital/aitrainmain'
import textprod from '@/views/digital/traintext-prod.vue'
import VideoProd from '@/views/digital/video-prod.vue'

import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { watch } from 'vue'
const videoProd = ref()
/** 数字人课程管理 表单 */
defineOptions({ name: 'AiTrainMainForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const pptInfo = ref({})
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  trainId: undefined,
  trainName: undefined,
  trainType: undefined,
  systemType: undefined,
  eparchyCode: undefined,
  liveCover: undefined,
  liveDesc: undefined,
  createType: undefined,
  copywriteId: undefined,
  videoId: undefined,
  videoUrl: undefined,
  watchState: undefined,
  state: undefined,
  videoDuration: undefined,
  remark: undefined,
  phoneFIle: null,
  videoFIle: null
})
//alert("congjy按钮值为1:"+formData.value.createType)
const formRules = reactive({
  trainName: [{ required: true, message: '视频名称不能为空', trigger: 'blur' }],
  trainType: [{ required: true, message: '视频分类不能为空', trigger: 'change' }],
  systemType: [{ required: true, message: '系统归属不能为空', trigger: 'change' }],
  createType: [{ required: true, message: '创建类型不能为空', trigger: 'change' }],
  liveDesc: [{ required: true, message: '课程简介不能为空', trigger: 'change' }],
  eparchyCode: [{ required: true, message: '地市归属不能为空', trigger: 'change' }],
  // phoneFIle: [
  //   {
  //     required: true,
  //     message: '请上传封面文件',
  //     trigger: 'blur'
  //   }
  // ],
  videoFIle: [
    {
      required: true,
      message: '请上传视频文件',
      trigger: 'blur'
    }
  ]

})
const formRef = ref() // 表单 Ref
const textprodRef = ref(null) //第二步表单内容
const activeStep = ref(0) // 当前激活的步骤：0-基本信息；1-文案编辑；2-视频合成；
const imageUrl = ref('')
const videoUrl = ref('')
const videoDuration = ref('')
const completedFlag = ref(false) // 是否完成
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  //alert("congjy按钮值为:"+type)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  //alert("congjy按钮值1为:"+formData.value.createType)
  //alert("congjy按钮值2为:"+formType.value)
  resetForm()
  //debugger;
   if (!formData.value.id) {
    //formData.value.id='1234'
    var maxid=await AiTrainMainApi.getmaxid()
    //debugger;
    formData.value.id = (maxid) ;
   }else {
    formData.value.id=id
   }
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      debugger;
      formData.value = await AiTrainMainApi.getbaseinfo(id)
      //初始化封面和视频控件
      imageUrl.value = formData.value.liveCover
      videoUrl.value = formData.value.videoUrl
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const getpptInfo = val =>{
  pptInfo.value = val
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  console.log("submitForm()----------------->formData.value:"+JSON.stringify(formData.value))
  try {
  ////////////////////////////////////////////////////////////////////////////////////////////////////
      // 创建一个新的 FormData 实例
      const locformData = new FormData()

      // 将 formData.value 中的数据添加到 locformData 中
      for (const key in formData.value) {
        if (formData.value.hasOwnProperty(key)) {
          if (key === 'phoneFIle' && formData.value[key]) {
            locformData.append(key, formData.value[key] as Blob)
          } else if (key === 'videoFIle' && formData.value[key]) {
            locformData.append(key, formData.value[key] as Blob)
          } else {
            locformData.append(key, formData.value[key])
          }
        }
      }
   console.log("submitForm()----------------->locformData:"+JSON.stringify(locformData))

  ////////////////////////////////////////////////////////////////////////////////////////////////////
    const data = formData.value as unknown as AiTrainMainVO
    if (formType.value === 'create' || formType.value === 'createupload' || data.createType === '2') {
      await AiTrainMainApi.uploadvideoAiTrainMain(data)
      message.success(t('common.createSuccess'))
    } else if(formType.value === 'update' && data.createType === '1'){
      await AiTrainMainApi.baseinfoAiTrainMain(data)
      message.success(t('common.createSuccess'))
    } else {
      await AiTrainMainApi.updateAiTrainMain(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  // 根据 formType 设置 createType 的默认值
  if (formType.value === 'create') {
    formData.value = {
      id: undefined,
      trainId: undefined,
      trainName: undefined,
      trainType: '1',
      systemType: undefined,
      eparchyCode: undefined,
      liveCover: undefined,
      liveDesc: undefined,
      createType: '1',
      copywriteId: undefined,
      videoId: undefined,
      videoUrl: undefined,
      watchState: undefined,
      state: '1',
      videoDuration: undefined,
      remark: undefined,
      phoneFIle: undefined,
      videoFIle: undefined
    }
  } else if (formType.value === 'createupload') {
    formData.value = {
      id: undefined,
      trainId: undefined,
      trainName: undefined,
      trainType: undefined,
      systemType: undefined,
      eparchyCode: undefined,
      liveCover: undefined,
      liveDesc: undefined,
      createType: '2',
      copywriteId: undefined,
      videoId: undefined,
      videoUrl: undefined,
      watchState: undefined,
      state: '1',
      videoDuration: undefined,
      remark: undefined,
      phoneFIle: undefined,
      videoFIle: undefined
    }
  }
  activeStep.value = 0;
  formRef.value?.resetFields()
}
//congjy
const onChange = (file: any) => {
  console.log(file)
  if (file.status === 'ready') {
    const formData = new FormData()
    // formData.append('id', String(itemId.value))
    // formData.append('pptFIle', file.raw, file.name)
    // formData.append('oprStaff', String(userStore.getUser.id))
    // uploadPPT(formData).then((resp) => {
    //   if(resp)
    //     message.success('上传成功')
    //   getList()
    // })
  }
}
const handleUpload = (file) => {
  const locformData = new FormData()
  locformData.append('file', file.raw as Blob)
  const config = {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log('onUpdatedProgress', progress)
    }
  }
  return AiTrainMainApi.uploadLiveCover(locformData, config).then((res) => {
    const isImage = file.raw?.type.startsWith('image/')
    if (isImage) {
      imageUrl.value = res.data.url
    }
    formData.value.liveCover = res.data.url
    return res.data.url || ''
  })
}

const handleUploadvideo = (file) => {
  const locformData = new FormData()
  locformData.append('file', file.raw as Blob)
  const config = {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log('onUpdatedProgress', progress)
    }
  }
  return AiTrainMainApi.uploadvideo(locformData, config).then((res) => {
    const isvideo = file.raw?.type.startsWith('video/')
    if (isvideo) {
      videoUrl.value = res.data.url
      videoDuration.value = res.data.seconds
    }
    formData.value.videoUrl = res.data.url
    formData.value.videoDuration = res.data.seconds
    //console.log('aaaaaaaaaaaaaaa-1:', formData.value.videoUrl)
    //console.log('aaaaaaaaaaaaaaa-2:', formData.value.videoDuration )
    return res.data.url || ''
  })
}


const nextStep = (file) => {
// 调试信息：检查 formRef 是否存在
  console.log('formRef7777777:', JSON.stringify(formData.value));

  
  // 检查 trainName 是否为空
  if (!formData.value.trainName) {
    ElMessage.error('课程名称不能为空')
    return
  }
  // 检查 trainType 是否为空
  if (!formData.value.trainType) {
    ElMessage.error('课程分类不能为空')
    return
  }
  // 检查 systemType 是否为空
  if (!formData.value.systemType) {
    ElMessage.error('系统归属不能为空')
    return
  }
  // 检查 liveDesc 是否为空
  if (!formData.value.liveDesc) {
    ElMessage.error('课程简介不能为空')
    return
  }
  // 检查 liveDesc 是否为空
  if (!formData.value.eparchyCode) {
    ElMessage.error('地市归属不能为空')
    return
  }
  console.log("nextStep()-------->isPPt:"+formData.value.isPPt)
  console.log("nextStep()-------->isVideo:"+formData.value.isVideo)
  console.log("nextStep()-------->createupload:"+formType.value)
  if (activeStep.value < 2 && formType.value === 'create') {
    activeStep.value++
  }else{
    if (activeStep.value === 0) {
      if (formData.value.isPPt === "0" && formData.value.isVideo === "0") {
        activeStep.value = 1;
      } else if (formData.value.isPPt === "0" && formData.value.isVideo === "1") {
        activeStep.value = 2;
      } else if (formData.value.isPPt === "1" && formData.value.isVideo === "0") {
        activeStep.value = 2;
      } else if (formData.value.isPPt === "1" && formData.value.isVideo === "1") {
        activeStep.value = 0;
      }
    } else if (activeStep.value === 1) {
      if (formData.value.isVideo === "0") {
        activeStep.value = 2;
      } else if (formData.value.isVideo === "1") {
        activeStep.value = 0;
      }
    }
  }

  const locformData = new FormData()
  console.log("nextStep()----------------->id:"+formData.value.id)
  console.log("nextStep()----------------->trainName:"+formData.value.trainName)
  console.log("nextStep()----------------->file:"+file)

  // 将 formData 中的数据添加到 locformData 中
  for (const key in formData.value) {
    if (formData.value.hasOwnProperty(key)) {
       if (key === 'phoneFIle' && formData.value[key]) {
              locformData.append(key, formData.value[key] as Blob);
            } else {
              locformData.append(key, formData.value[key]);
            }
    }
  }

  // 将文件添加到 locformData 中
  if (file) {
    locformData.append('phoneFIle', file);
  }

  formLoading.value = true
  try {
  const data = formData.value as unknown as AiTrainMainVO
  AiTrainMainApi.baseinfoAiTrainMain(data)
  message.success('对话配置已更新')
    //dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  console.log("nextStep()----------------->end:")
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}
const submitForm1 = () => {
  // 在这里处理表单提交逻辑
  console.log('表单已提交')
  // 关闭弹窗
  dialogVisible.value = false
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
//上传视频
const beforeAvatarUploadvideo: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'video/*') {
    ElMessage.error('Avatar video must be video format!')
    return false
  }
  //else if (rawFile.size / 1024 / 1024 > 300) {
  //  ElMessage.error('Avatar video size can not exceed 300MB!')
  //  return false
  //}
  return true
}
// dp在 script setup 中
// const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (file) {
//     formData.value.phoneFIle = file; // 将文件保存到 formData 的 phoneFIle 字段
//   }
// };

const fileError = ref("");

// 文件选择处理函数
const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  //debugger
  if (file) {
    //debugger
     // 校验文件扩展名是否为 .mp4
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      debugger
      fileError.value = "文件必须是 .jpg或.png 格式";
      return ElMessage.error("文件必须是 .jpg或.png 格式")
      
    }

    // 校验文件大小（例如不超过5MB）
    if (file.size > 5 * 1024 * 1024) {
      fileError.value = "文件大小不能超过5MB";
      return ElMessage.error("文件大小不能超过5MB")
    }
    // 将文件保存到 formData
    formData.value.phoneFIle = file;
    fileError.value = "";
  }
};
const handlevideoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
     // 校验文件扩展名是否为 .mp4
     if (file.type !== 'video/mp4') {
      fileError.value = "文件必须是 .mp4 格式";
      return ElMessage.error("文件必须是 .mp4 格式")
      
    }
    // 校验文件大小（例如不超过500MB）
    if (file.size > 500 * 1024 * 1024) {
      fileError.value = "文件大小不能超过500MB";
      return;
    }
    // 将文件保存到 formData
    formData.value.videoFIle = file;
    fileError.value = "";
  }
};
// 监听 id 的变化，同步到 trainId
watch(
  () => formData.value.id,
  (newId) => {
    if (newId !== undefined) {
      formData.value.trainId = newId
    }
  }
)
/** 重置表单 */
const commitLiveVideo = () => {
  videoProd.value.commitTrainVideo(formData.value.id);
  completedFlag.value = true
  activeStep.value = 0
  dialogVisible.value = false
  console.log('视频生成')
  emit('success')

}

const closeDialog = async () => {
  if (activeStep.value > 0 && !completedFlag.value) {
    await AiTrainMainApi.deleteAiTrainMain(Number(formData.value.id))
  }
  console.log('关闭弹窗')
  dialogVisible.value = false
  resetForm()
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.el-icon.avatar-uploader-iconvideo {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.custom-upload .el-upload-list {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  width: 300px;
}

.custom-upload .el-upload-list__item {
  color: #333;
  font-size: 14px;
}

.custom-upload .el-upload-list__item:hover {
  background-color: #e6f7ff;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border: 2px solid #ccc; /* 添加边框 */
  border-radius: 6px; /* 可选：添加圆角 */
  object-fit: cover; /* 确保图片按比例缩放并填充容器 */
}

</style>
