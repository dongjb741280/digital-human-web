<!--文案制作-->
<script lang="ts" setup>
import {
  createOutline,
  getAgentList,
  createPPTAndTextBoy,
  createPPT,
  getTextPPTModel,
  uploadFile
} from '@/api/digital'
import { Edit, Bottom } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { v4 as uuid } from 'uuid'
import Results from './live/Results.vue'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  info:{
    type: Object,
  }
})
const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const formModel = reactive({
  uuid: '',
  doc_name: '',
  requirement: '',
  outline: '',
  conversation_id: '',
  type: '0',
  smart_id: 'app-UUSbEkEHAfGTydGcoeanou1h',
  title: '',
  text: '',
  pptId: '',
  trainId: '',
  fileId: ''
})
const agentList = ref([])
const fileList = ref([])
const rules = {
  doc_name: [{ required: true, message: '请输入文案名称', trigger: 'blur' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  //requirement: [{ required: true, message: '请输入主题描述！', trigger: 'blur' }]
}
const uploadFileLoading = ref(false)
const loading1 = ref(false)
const loading2 = ref(false)
const isOutline = ref(false)
const options = ref([])
const pptInfo = ref({})
// const proctype = ref(2)
const resultsRef = ref() // 添加 Results 组件的引用
const emits = defineEmits(['getpptInfo'])
const onSubmit = () => {
  // 生成课件文案
  if (formModel.outline.length === 0) {
    ElMessage.error('请先生成课件大纲')
    return
  }
  formRef.value.validate(async (valid: any) => {
    if (valid) {
      loading2.value = true
      // proctype.value = 3
      resultsRef.value?.show(3)
      try {
        const resp = await createPPTAndTextBoy({
          ...formModel,
          outline: formModel.outline.replace(/\n\n/g, '\\n\\n').replace(/\n/g, '\\n'),
          user: userStore.user.id,
          fileId: fileList.value.length > 0 ? fileId.value : ''
        })
        formModel.text = resp.text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
        formModel.conversation_id = resp.conversation_id
        resultsRef.value?.success()
      } catch (error) {
        console.log(error)
        resultsRef.value?.fail()
      }
      loading2.value = false
    } else {
      console.log('error submit!!')
    }
  })
}
const onCreateOutline = () => {
  formRef.value.validate(async (valid: any) => {
    if (valid) {
      loading1.value = true
      // proctype.value = 2
      resultsRef.value?.show(2)
      try {
        const resp = await createOutline({
          ...formModel,
          user: userStore.user.id,
          uuid: new Date().getTime(),
          fileId: fileList.value.length > 0 ? fileId.value : ''
          //fileId: formModel.fileId
        })
        if (resp.text)
          formModel.outline = resp.text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
        formModel.conversation_id = resp.conversation_id
        isOutline.value = true
        loading1.value = false
        resultsRef.value?.success()
      } catch (error) {
        console.log(error)
        loading1.value = false
        resultsRef.value?.fail()
      }
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
const loading3 = ref(false)
const submitForm = async (type) => {
  if (formModel.text.length === 0) {
    ElMessage.error('请先生成文案')
    return
  }
  loading3.value = true
  // proctype.value = 4
  resultsRef.value?.show(4)
  // 生成PPT
  try {
    const resp = await createPPT({ ...formModel, content: formModel.text, user: userStore.user.id, trainId: props.info.id })
    loading3.value = false
    if (resp) {
      // 制作成功
      ElMessage.success('制作成功')
      emits('getpptInfo',{
        pptId: resp.pptId,
        copyrightId:  resp.mainPPtId,
        pptName: formModel.title
      })
      resultsRef.value?.success()
      // router.push('/digital/text-mgmt')
    }
  } catch (error) {
    loading3.value = false
    resultsRef.value?.fail()
  }
}

watch(
  () => formModel.type,
  (val) => {
    if (val === '1') {
      delete rules.requirement
      formModel.outline = ''
      formModel.requirement = ''
      formModel.text = ''
    } else {
      rules.requirement = [{ required: true, message: '请输入主题描述', trigger: 'blur' }]
    }
  }
)
const fileId = ref('')
const fileError = ref("");

const onChange = (file: any) => {
  console.log("formModel---------------------------8888888888:"+JSON.stringify(file))
  // const file = event.target.files?.[0];
  if (file) {
  debugger
     // 校验文件扩展名是否为 .docx
    //if (file.row.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ) {
    if (!file.raw.name.endsWith('.docx') ) {
      fileError.value = "文件必须是 .docx 格式";
      return ElMessage.error("文件必须是 .docx 格式")
      
    }

    // 校验文件大小（例如不超过5MB）
    if (file.size > 50 * 1024 * 1024) {
      fileError.value = "文件大小不能超过50MB";
      return;
    }
    fileError.value = "";
  }


  console.log("traintext-prod.vue onChange()------------------>:"+props.info.id)
    // 将 formData 中的数据添加到 locformData 中
  fileList.value = []
  if (file.status === 'ready') {
    fileList.value.push(file)
    const formData = new FormData()
    fileId.value = uuid()
    formData.append('id', fileId.value)
    formData.append('file', file.raw, file.name)
    formData.append('oprStaff', String(userStore.user.id))
    formData.append('trainId', props.info.id)
    uploadFileLoading.value = true
    debugger
    uploadFile(formData)
      .then((resp) => {
        if (resp) {
          //打印返回结果和结果中的id值
          console.log("hahahaha------------------------1:"+JSON.stringify(resp))
          console.log("hahahaha------------------------2:"+resp.data.id)
          console.log("hahahaha------------------------2:"+resp.data.name)
          // 获取文件名部分
          const fileNameWithExtension = resp.data.name.split('/').pop()
          if (fileNameWithExtension) {
            const fileName = fileNameWithExtension.split('.').shift()
            if (fileName) {
              console.log("截取的文件名:", fileName) // 输出: aa
              formModel.doc_name = fileName
              formModel.fileId = resp.data.id
              fileId.value = resp.data.id
              console.log("formModel---------------------------999999999:"+JSON.stringify(formModel))
            } else {
              console.log("无法截取文件名")
            }
          } else {
            console.log("无法获取文件名部分")
          }
          
          /////////////////////////////////////////////////////////////////////////////
          ElMessage.success('上传成功')
        }
      })
      .catch(() => {
        fileList.value = []
      })
      .finally(() => {
        debugger
        uploadFileLoading.value = false
        console.log("formModel---------------------------999999999-2:"+JSON.stringify(formModel))
      })
  }
}


const handleExceed = (files: any, fileList: any) => {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
  )
}

onMounted(async () => {
  agentList.value = await getAgentList()

  options.value = await getTextPPTModel()
})
</script>

<template>
  <!-- 第一步（即：基本信息页面）传递的参数：{{ props }} -->
 
  <el-form
    :model="formModel"
    :rules="rules"
    label-width="auto"
    label-position="top"
    ref="formRef"
    v-loading="uploadFileLoading"
    style="max-height: 60vh; overflow: scroll;"
  >
  <el-alert
    type="info"
    :closable="false"
    style="margin-bottom: 20px; background-color: #f5f7fa;"
  >
    <template #title>
      <div class="flex items-center">
        <el-icon class="mr-2"><info-filled /></el-icon>
        <span class="font-medium">文案制作步骤说明</span>
      </div>
    </template>
    <ol class="list-decimal pl-4 text-gray-500 text-sm">
      <li class="mb-1">请先上传文件</li>
      <li class="mb-1">执行生成提纲，由于AI存在偶尔的理解偏差，提纲生成后需检查下提纲生成是否正确</li>
      <li class="mb-1">执行生成课件文案，AI思考整个文档过程时间较长，预计3分钟</li>
      <li class="mb-1">选择PPT模板后，执行一键生成PPT课件</li>
      <li>以上全部完成后，点击下一步</li>
    </ol>
  </el-alert>
    <div class="flex gap-4 h-full">
      <div
        class="flex-1 min-h-[calc(100vh_-_180px)] p-20px border border-solid border-coolgray-100 rounded-2 shadow-sm"
      >

<!--        <el-form-item prop="type" label="参考上传">-->
<!--        </el-form-item>-->
        <el-form-item prop="file" label="">
          <el-upload
            ref="uploadRef"
            action="none"
            accept=".docx"
            :auto-upload="false"
            :file-list="fileList"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="onChange"
          >
            <template #trigger>
              <el-button type="primary" size="small">上传文件</el-button>
            </template>
            <template #tip>
              <div class="text-xs text-coolgray-400">
                <p>支持上传docx格式文件,文件大小不超过10M</p>
              </div>
            </template>
          </el-upload>
        </el-form-item>


        <el-form-item prop="doc_name" label="文案名称">
          <el-input v-model="formModel.doc_name" placeholder="请输入文案名称" />
        </el-form-item>


      <!-- <el-form-item label="参考上传" prop="state">
        <label for="phoneFile"></label>
        <input
          type="file"
          id="wordFile"
          @change="onChange" 
        />
      </el-form-item>

      <div class="text-xs text-coolgray-400">
                <p>支持上传docx、doc格式文件,文件大小不超过10M</p>
        </div> -->

        <el-form-item prop="" label="智能体选择"  v-show="false">
          <el-select v-model="formModel.smart_id" placeholder="请选择智能体进行文案创作">
            <el-option
              v-for="item in agentList"
              :key="item.id"
              :value="item.id"
              :label="item.agentName"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="title" label="主题">
          <el-input v-model="formModel.title" placeholder="请输入主题" />
        </el-form-item> -->

        <div v-if="formModel.type === '0'">
          <!-- <el-form-item prop="requirement" label="主题描述">
            <el-input
              v-model="formModel.requirement"
              type="textarea"
              :rows="5"
              placeholder="请输入主题描述"
              :maxlength="1000"
              show-word-limit
            />
          </el-form-item> -->
          <el-form-item>
            <el-button
              class="w-full"
              type="primary"
              @click="onCreateOutline"
              :icon="Bottom"
              :loading="loading1"
              >生成提纲</el-button
            >
          </el-form-item>
          <div v-if="isOutline">
            <el-form-item prop="requirement" label="课件大纲">
              <el-input
                v-model="formModel.outline"
                type="textarea"
                :rows="13"
                placeholder="请输入课件大纲"
                :maxlength="1000"
                show-word-limit
                class="ws-pre-wrap break-all"
              />
            </el-form-item>

            <el-form-item>
              <el-button class="w-full" type="primary" @click="onSubmit" :loading="loading2"
                >生成课件文案</el-button
              >
            </el-form-item>
          </div>
        </div>
        <el-form-item v-else>
          <el-button class="w-full" type="primary" @click="onSubmit" :loading="loading2"
            >生成文案</el-button
          >
        </el-form-item>
      </div>
      <div
        class="flex-1 min-h-[calc(100vh_-_180px)] p-20px border border-solid border-coolgray-100 rounded-2 shadow-sm"
      >
        <div class="flex justify-between pb-15px">
          <span class="text-size-14px text-#606266">文案内容</span>
<!--          <el-button type="primary" size="small" :icon="Edit">AI改写</el-button>-->
        </div>
        <el-form-item prop="text" label="" label-width="0px">
          <v-md-editor
            v-model="formModel.text"
            mode="edit"
            height="500px"
            left-toolbar="undo redo h bold italic"
            right-toolbar="preview fullscreen"
          />
        </el-form-item>

        <el-form-item prop="pptId" label="请选择PPT模板" label-width="110px">
          <el-select v-model="formModel.pptId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.ppt_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="w-full" type="primary" :loading="loading3" @click="submitForm('ppt')"
            >一键生成PPT课件</el-button
          >
        </el-form-item>
      </div>
    </div>
  </el-form>
  <Results ref="resultsRef"></Results>
</template>
