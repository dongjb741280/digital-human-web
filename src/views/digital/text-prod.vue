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
  smart_id: '',
  title: '',
  text: '',
  pptId: ''
})
const agentList = ref([])
const fileList = ref([])
const rules = {
  doc_name: [{ required: true, message: '请输入文案名称', trigger: 'blur' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  requirement: [{ required: true, message: '请输入主题描述', trigger: 'blur' }]
}
const uploadFileLoading = ref(false)
const loading1 = ref(false)
const loading2 = ref(false)
const isOutline = ref(false)
const options = ref([])
const onSubmit = () => {
  // 生成课件文案

  formRef.value.validate(async (valid: any) => {
    if (valid) {
      loading2.value = true
      try {
        const resp = await createPPTAndTextBoy({
          ...formModel,
          outline: formModel.outline.replace(/\n\n/g, '\\n\\n').replace(/\n/g, '\\n'),
          user: userStore.user.id,
          fileId: fileList.value.length > 0 ? fileId.value : ''
        })
        formModel.text = resp.text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
        formModel.conversation_id = resp.conversation_id
      } catch (error) {
        console.log(error)
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
      try {
        const resp = await createOutline({
          ...formModel,
          user: userStore.user.id,
          uuid: new Date().getTime(),
          fileId: fileList.value.length > 0 ? fileId.value : ''
        })
        if (resp.text)
          formModel.outline = resp.text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
        formModel.conversation_id = resp.conversation_id
        isOutline.value = true
        loading1.value = false
      } catch (error) {
        console.log(error)
        loading1.value = false
      }
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
const loading3 = ref(false)
const submitForm = async (type) => {
  loading3.value = true
  // 生成PPT
  try {
    const resp = await createPPT({ ...formModel, content: formModel.text, user: userStore.user.id })
    loading3.value = false
    if (resp) {
      // 制作成功
      ElMessage.success('制作成功')
      router.push('/digital/text-mgmt')
    }
  } catch (error) {
    loading3.value = false
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
const onChange = (file: any) => {
  fileList.value = []
  if (file.status === 'ready') {
    fileList.value.push(file)
    const formData = new FormData()
    fileId.value = uuid()
    formData.append('id', fileId.value)
    formData.append('file', file.raw, file.name)
    formData.append('oprStaff', String(userStore.user.id))
    uploadFileLoading.value = true
    uploadFile(formData)
      .then((resp) => {
        if (resp) {
          ElMessage.success('上传成功')
        }
      })
      .catch(() => {
        fileList.value = []
      })
      .finally(() => {
        uploadFileLoading.value = false
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
  <el-form
    :model="formModel"
    :rules="rules"
    label-width="auto"
    label-position="top"
    ref="formRef"
    v-loading="uploadFileLoading"
  >
    <div class="flex gap-4 h-full">
      <div
        class="flex-1 min-h-[calc(100vh_-_180px)] p-20px border border-solid border-coolgray-100 rounded-2 shadow-sm"
      >
        <el-form-item prop="doc_name" label="文案名称">
          <el-input v-model="formModel.doc_name" placeholder="请输入文案名称" />
        </el-form-item>
        <el-form-item prop="type" label="制作方式">
          <el-radio-group v-model="formModel.type">
            <el-radio label="0">生成课件文案</el-radio>
            <el-radio label="1">生成简单文案</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="file" label="">
          <el-upload
            ref="uploadRef"
            action="none"
            accept=".txt, .docx,.doc,.pdf"
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
                <p>支持上传txt、docx、doc、pdf格式文件,文件大小不超过10M</p>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item prop="" label="智能体选择">
          <el-select v-model="formModel.smart_id" placeholder="请选择智能体进行文案创作">
            <el-option
              v-for="item in agentList"
              :key="item.id"
              :value="item.id"
              :label="item.agentName"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="主题">
          <el-input v-model="formModel.title" placeholder="请输入主题" />
        </el-form-item>
        <div v-if="formModel.type === '0'">
          <el-form-item prop="requirement" label="主题描述">
            <el-input
              v-model="formModel.requirement"
              type="textarea"
              :rows="5"
              placeholder="请输入主题描述"
              :maxlength="1000"
              show-word-limit
            />
          </el-form-item>
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
                :rows="10"
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
</template>
