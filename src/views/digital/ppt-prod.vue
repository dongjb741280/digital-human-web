<!--PPT 创作（复刻 ai-to-pptx 五步向导，对接现有后端）-->
<script lang="ts" setup>
import {
  createOutline,
  createPPTAndTextBoy,
  createPPT,
  getTextPPTModel,
  getPPTThumbnailList,
  downloadPPT,
  uploadFile,
  getAgentList
} from '@/api/digital'
import { ElMessage } from 'element-plus'
import { Loading, ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { v4 as uuid } from 'uuid'
import download from '@/utils/download'

defineOptions({ name: 'PptProd' })

const router = useRouter()
const userStore = useUserStore()

const steps = [
  { title: '开始创作', subtitle: '输入主题与要求' },
  { title: '生成大纲', subtitle: 'AI 自动生成大纲' },
  { title: '编辑大纲', subtitle: '调整大纲内容' },
  { title: '选择模板', subtitle: '挑选 PPT 风格' },
  { title: '生成 PPT', subtitle: '一键生成并下载' }
]
const activeStep = ref(0)

const formModel = reactive({
  doc_name: '',
  title: '',
  requirement: '',
  outline: '',
  text: '',
  conversation_id: '',
  smart_id: '',
  pptId: '',
  copywriteId: ''
})

// 更多生成要求
const showMoreOptions = ref(false)
const moreOptions = reactive({
  moreRequirement: '',
  language: 'zh-CN',
  outlineLength: 'regular'
})

// 上传文件
const fileList = ref([])
const fileId = ref('')
const uploadFileLoading = ref(false)

// 智能体
const agentList = ref([])

// 模板
const templates = ref<any[]>([])
const selectedTemplateId = ref('')

// 加载状态
const loadingOutline = ref(false)
const loadingPpt = ref(false)

// PPT 预览
const thumbnails = ref<any[]>([])
const selectedThumb = ref<any>(null)

// 组装「主题描述」，把更多要求/语言/篇幅合并进 requirement
const buildRequirement = () => {
  const parts: string[] = []
  if (formModel.requirement) parts.push(formModel.requirement)
  if (moreOptions.moreRequirement) parts.push('更多要求：' + moreOptions.moreRequirement)
  if (moreOptions.language === 'en') parts.push('请使用英文输出')
  const lengthHint =
    moreOptions.outlineLength === 'short'
      ? '大纲篇幅较短（约 10-15 页）'
      : moreOptions.outlineLength === 'long'
        ? '大纲篇幅较长（约 25-35 页）'
        : '大纲篇幅常规（约 20-30 页）'
  parts.push(lengthHint)
  return parts.join('\n')
}

const uid = () => String(userStore.getUser.id)

// 第 0 步 -> 第 1 步：立即生成（校验后进入大纲生成）
const goGenerateOutline = async () => {
  if (!formModel.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  activeStep.value = 1
  await generateOutline()
}

const generateOutline = async () => {
  loadingOutline.value = true
  try {
    const resp = await createOutline({
      title: formModel.title,
      requirement: buildRequirement(),
      user: uid(),
      smart_id: formModel.smart_id,
      uuid: new Date().getTime(),
      fileId: fileId.value || ''
    })
    if (resp && resp.text) {
      formModel.outline = resp.text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
      formModel.conversation_id = resp.conversation_id
    } else {
      ElMessage.warning('未生成出大纲，请重试')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('生成大纲失败')
  } finally {
    loadingOutline.value = false
  }
}

// 第 3 步进入时加载模板
const loadTemplates = async () => {
  try {
    const res = (await getTextPPTModel()) || []
    templates.value = res.length ? res : [{ id: 'default', ppt_name: '默认模板' }]
    selectedTemplateId.value = templates.value[0].id
  } catch (error) {
    console.error(error)
    templates.value = [{ id: 'default', ppt_name: '默认模板' }]
    selectedTemplateId.value = 'default'
  }
}

// 模板缩略图（后端暂未提供图片字段，回退到占位样式）
const templateImage = (item: any) =>
  item.ppt_image || item.image || item.thumb || item.url || item.preview || ''

// 第 4 步：生成 PPT（先提纲->正文，再生成 PPT）
const generatePpt = async () => {
  loadingPpt.value = true
  thumbnails.value = []
  selectedThumb.value = null
  try {
    // 1. 提纲 -> 正文
    const bodyResp = await createPPTAndTextBoy({
      title: formModel.title,
      outline: formModel.outline.replace(/\n\n/g, '\\n\\n').replace(/\n/g, '\\n'),
      user: uid(),
      smart_id: formModel.smart_id,
      fileId: fileId.value || ''
    })
    if (bodyResp && bodyResp.text) {
      formModel.text = bodyResp.text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
      formModel.conversation_id = bodyResp.conversation_id
    }
    // 2. 生成 PPT
    const pptResp = await createPPT({
      title: formModel.title,
      text: formModel.text,
      content: formModel.text,
      doc_name: formModel.doc_name || formModel.title,
      user: uid(),
      smart_id: formModel.smart_id,
      pptId: selectedTemplateId.value
    })
    if (pptResp && pptResp.pptId) {
      formModel.pptId = pptResp.pptId
      formModel.copywriteId = pptResp.copywriteId
      ElMessage.success('PPT 生成成功')
      await loadThumbnails()
    } else {
      ElMessage.warning('PPT 生成未返回结果')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('生成 PPT 失败')
  } finally {
    loadingPpt.value = false
  }
}

const loadThumbnails = async () => {
  if (!formModel.pptId) return
  try {
    const res = await getPPTThumbnailList({ pptId: formModel.pptId })
    if (res && res.length) {
      thumbnails.value = res.map((item: any) => ({
        num: item.ppt_num,
        url: item.ppt_image_url,
        desc: item.ppt_image_words
      }))
      selectedThumb.value = thumbnails.value[0]
    }
  } catch (error) {
    console.error(error)
  }
}

const onDownload = async () => {
  if (!formModel.pptId) {
    ElMessage.warning('请先生成 PPT')
    return
  }
  try {
    const resp = await downloadPPT({ id: formModel.pptId })
    download.pptx(resp, (formModel.doc_name || formModel.title || '课件') + '.pptx')
  } catch (error) {
    console.error(error)
    ElMessage.error('下载失败')
  }
}

const goTextMgmt = () => {
  router.push('/digital/text-mgmt')
}

const goEdit = () => {
  router.push({ path: '/digital/ppt-collabora', query: { pptId: formModel.pptId } })
}

const onChange = (file: any) => {
  fileList.value = []
  if (file.status === 'ready') {
    fileList.value.push(file)
    const formData = new FormData()
    fileId.value = uuid()
    formData.append('id', fileId.value)
    formData.append('file', file.raw, file.name)
    formData.append('oprStaff', uid())
    uploadFileLoading.value = true
    uploadFile(formData)
      .then(() => ElMessage.success('上传成功'))
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

const goStep = (step: number) => {
  if (step === 3 && !templates.value.length) loadTemplates()
  activeStep.value = step
  if (step === 4) generatePpt()
}

onMounted(async () => {
  try {
    agentList.value = await getAgentList()
  } catch (error) {
    console.error(error)
  }
  loadTemplates()
})
</script>

<template>
  <div class="ppt-prod">
    <!-- 顶部步骤条 -->
    <div class="stepper">
      <div
        v-for="(s, i) in steps"
        :key="i"
        class="stepper-item"
        :class="{ active: i === activeStep, done: i < activeStep }"
        @click="i < activeStep && goStep(i)"
      >
        <div class="step-dot">{{ String(i + 1).padStart(2, '0') }}</div>
        <div class="step-text">
          <div class="step-title">{{ s.title }}</div>
          <div class="step-subtitle">{{ s.subtitle }}</div>
        </div>
        <div v-if="i < steps.length - 1" class="step-line" :class="{ done: i < activeStep }"></div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content" v-loading="uploadFileLoading">
      <!-- 第 0 步：开始创作 -->
      <div v-if="activeStep === 0" class="step-panel">
        <div class="panel-title">输入主题与要求，AI 帮你生成漂亮 PPT</div>
        <el-form label-position="top">
          <el-form-item label="标题" required>
            <el-input v-model="formModel.title" placeholder="请输入 PPT 主题，例如：2026 年 AI 行业趋势" maxlength="100" />
          </el-form-item>
          <el-form-item label="主题描述">
            <el-input
              v-model="formModel.requirement"
              type="textarea"
              :rows="4"
              placeholder="补充更具体的要求，例如：面向管理层、突出数据、风格商务"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="文案名称">
                <el-input v-model="formModel.doc_name" placeholder="留空默认使用标题" maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="智能体">
                <el-select v-model="formModel.smart_id" clearable placeholder="选择智能体人设（可选）" class="w-full">
                  <el-option
                    v-for="item in agentList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.agentName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="导入资料（可选）">
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
                <el-button type="primary" plain size="small">上传文件</el-button>
              </template>
              <template #tip>
                <div class="text-xs text-coolgray-400">支持 txt、docx、doc、pdf，大小不超过 10M</div>
              </template>
            </el-upload>
          </el-form-item>

          <div class="more-toggle" @click="showMoreOptions = !showMoreOptions">
            <span>更多生成要求</span>
            <el-icon><ArrowDown v-if="showMoreOptions" /><ArrowRight v-else /></el-icon>
          </div>
          <div v-if="showMoreOptions" class="more-panel">
            <el-form-item label="更多要求">
              <el-input
                v-model="moreOptions.moreRequirement"
                type="textarea"
                :rows="3"
                placeholder="补充其他要求"
                maxlength="500"
              />
            </el-form-item>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="大纲篇幅">
                  <el-select v-model="moreOptions.outlineLength" class="w-full">
                    <el-option value="short" label="较短 10-15 页" />
                    <el-option value="regular" label="常规 20-30 页" />
                    <el-option value="long" label="较长 25-35 页" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="语言">
                  <el-select v-model="moreOptions.language" class="w-full">
                    <el-option value="zh-CN" label="中文" />
                    <el-option value="en" label="英文" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <div class="step-actions">
          <el-button type="primary" size="large" @click="goGenerateOutline">立即生成</el-button>
        </div>
      </div>

      <!-- 第 1 步：生成大纲 -->
      <div v-else-if="activeStep === 1" class="step-panel">
        <div v-if="loadingOutline" class="generating">
          <el-icon class="is-loading" style="font-size: 28px"><Loading /></el-icon>
          <p>正在生成大纲，请稍后...</p>
        </div>
        <div v-else>
          <div class="panel-title">大纲生成结果</div>
          <div class="outline-preview">{{ formModel.outline }}</div>
          <div class="step-actions">
            <el-button @click="activeStep = 0">上一步</el-button>
            <el-button type="primary" @click="generateOutline">重新生成</el-button>
            <el-button type="primary" @click="activeStep = 2">下一步：编辑大纲</el-button>
          </div>
        </div>
      </div>

      <!-- 第 2 步：编辑大纲 -->
      <div v-else-if="activeStep === 2" class="step-panel">
        <div class="panel-title">编辑大纲</div>
        <v-md-editor
          v-model="formModel.outline"
          mode="edit"
          height="420px"
          left-toolbar="undo redo h bold italic"
          right-toolbar="preview fullscreen"
        />
        <div class="step-actions">
          <el-button @click="activeStep = 1">上一步</el-button>
          <el-button type="primary" @click="goStep(3)">下一步：选择模板</el-button>
        </div>
      </div>

      <!-- 第 3 步：选择模板 -->
      <div v-else-if="activeStep === 3" class="step-panel">
        <div class="panel-title">选择 PPT 模板</div>
        <div class="template-grid">
          <div
            v-for="tpl in templates"
            :key="tpl.id"
            class="template-card"
            :class="{ selected: tpl.id === selectedTemplateId }"
            @click="selectedTemplateId = tpl.id"
          >
            <img v-if="templateImage(tpl)" :src="templateImage(tpl)" :alt="tpl.ppt_name" />
            <div v-else class="template-placeholder">{{ tpl.ppt_name }}</div>
            <div class="template-name">{{ tpl.ppt_name }}</div>
          </div>
        </div>
        <div class="step-actions">
          <el-button @click="activeStep = 2">上一步</el-button>
          <el-button type="primary" @click="goStep(4)">下一步：生成 PPT</el-button>
        </div>
      </div>

      <!-- 第 4 步：生成 PPT -->
      <div v-else class="step-panel step-ppt">
        <div class="ppt-toolbar">
          <div class="ppt-actions">
            <el-button @click="activeStep = 3">更换模板</el-button>
            <el-button type="primary" :disabled="!formModel.pptId || loadingPpt" @click="onDownload">下载 PPT</el-button>
            <el-button type="primary" plain :disabled="!formModel.pptId" @click="goEdit">编辑</el-button>
            <el-button :disabled="!formModel.pptId" @click="goTextMgmt">查看文案</el-button>
            <el-button @click="generatePpt" :disabled="loadingPpt">重新生成</el-button>
          </div>
          <div v-if="loadingPpt" class="ppt-status">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>正在生成 PPT，请稍后...</span>
          </div>
        </div>

        <div v-if="loadingPpt" class="generating">
          <el-icon class="is-loading" style="font-size: 28px"><Loading /></el-icon>
          <p>正在生成 PPT，请稍后...</p>
        </div>
        <div v-else-if="thumbnails.length" class="ppt-preview">
          <div class="thumb-list">
            <div
              v-for="(t, i) in thumbnails"
              :key="i"
              class="thumb-item"
              :class="{ active: selectedThumb && selectedThumb.num === t.num }"
              @click="selectedThumb = t"
            >
              <span class="thumb-index">{{ i + 1 }}</span>
              <img :src="t.url" :alt="`第 ${i + 1} 页`" />
            </div>
          </div>
          <div class="preview-main">
            <img v-if="selectedThumb" :src="selectedThumb.url" :alt="`第 ${selectedThumb.num + 1} 页`" />
            <p v-if="selectedThumb && selectedThumb.desc" class="preview-desc">{{ selectedThumb.desc }}</p>
          </div>
        </div>
        <el-empty v-else description="暂无内容" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ppt-prod {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.stepper {
  display: flex;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.stepper-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  cursor: pointer;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eef1f6;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.2s;
}

.stepper-item.active .step-dot {
  background: #409eff;
  color: #fff;
}

.stepper-item.done .step-dot {
  background: #409eff;
  color: #fff;
  opacity: 0.7;
}

.step-text {
  margin-left: 8px;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.step-subtitle {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #eef1f6;
  margin: 15px 16px 0;
  flex-shrink: 0;
  transition: background 0.2s;
}

.step-line.done {
  background: #409eff;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.step-panel {
  max-width: 960px;
  margin: 0 auto;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.more-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  margin: 8px 0 16px;
}

.more-panel {
  padding: 16px;
  background: #f7f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.generating {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #909399;
  gap: 12px;
}

.outline-preview {
  white-space: pre-wrap;
  word-break: break-all;
  background: #f7f8fa;
  border-radius: 6px;
  padding: 20px;
  min-height: 300px;
  max-height: 480px;
  overflow-y: auto;
  line-height: 1.8;
  font-size: 14px;
  color: #303133;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.template-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.template-card.selected {
  border-color: #409eff;
}

.template-card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.template-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #409eff, #79bbff);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.template-name {
  padding: 8px 10px;
  font-size: 13px;
  color: #303133;
  text-align: center;
}

.step-ppt {
  max-width: 1200px;
}

.ppt-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ppt-actions {
  display: flex;
  gap: 12px;
}

.ppt-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #409eff;
  font-size: 14px;
}

.ppt-preview {
  display: flex;
  gap: 16px;
}

.thumb-list {
  width: 180px;
  flex-shrink: 0;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

.thumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 8px;
}

.thumb-item.active {
  border-color: #409eff;
}

.thumb-index {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.thumb-item img {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #eee;
  display: block;
}

.preview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-main img {
  max-width: 100%;
  max-height: calc(100vh - 300px);
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preview-desc {
  margin-top: 12px;
  color: #606266;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stepper-item {
    flex-direction: column;
    align-items: center;
  }
  .step-text {
    margin-left: 0;
    text-align: center;
  }
  .step-line {
    display: none;
  }
}
</style>
