<!--ppt-master 引擎生成 PPT（一键直出原生可编辑 .pptx，对接 /aiDhPpt/generate_ppt_master）-->
<script lang="ts" setup>
import { createPptMaster, getPptMasterStatus, getPPTThumbnailList, downloadPPT } from '@/api/digital'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import download from '@/utils/download'

defineOptions({ name: 'PptMaster' })

const userStore = useUserStore()
const router = useRouter()

const formModel = reactive({
  title: '',
  pages: 8,
  lang: 'zh-CN',
  canvas: 'ppt169',
  images: 'none',
  sources: '',
  template: ''
})

// 模版下拉选项（友好名称 → 引擎内的模版工作区路径）
const templateOptions = [
  { label: '自由设计（默认）', value: '' },
  { label: '通用母版 16:9（presentation_core）', value: 'skills/ppt-master/templates/layouts/presentation_core' },
  { label: '通用母版 4:3（presentation_core_43）', value: 'skills/ppt-master/templates/layouts/presentation_core_43' },
  { label: '中国电信 品牌模版', value: 'skills/ppt-master/templates/decks/中国电信' },
  { label: '中汽研 品牌模版', value: 'skills/ppt-master/templates/decks/中汽研' }
]

const loadingPpt = ref(false)
const pollTimer = ref<any>(null)
const jobStatus = ref('')
const progress = ref<any>(null)

const pptId = ref('')
const recordDesc = ref('')
const summary = ref('')

// PPT 预览
const thumbnails = ref<any[]>([])
const selectedThumb = ref<any>(null)

const uid = () => String(userStore.getUser.id)

const stopPolling = () => {
  if (pollTimer.value) {
    clearInterval(pollTimer.value)
    pollTimer.value = null
  }
}

const pollStatus = async (jobId: string) => {
  try {
    const res = await getPptMasterStatus(jobId)
    if (!res) return
    jobStatus.value = res.status
    progress.value = res.progress
    if (res.status === 'success') {
      stopPolling()
      loadingPpt.value = false
      if (res.pptId) {
        pptId.value = res.pptId
        recordDesc.value = res.recordDesc || formModel.title
        summary.value = res.summary || ''
        ElMessage.success('PPT 生成成功')
        await loadThumbnails()
      } else {
        ElMessage.warning('生成成功但未返回 pptId')
      }
    } else if (res.status === 'failed') {
      stopPolling()
      loadingPpt.value = false
      ElMessage.error(res.msg || '生成失败')
    }
  } catch (error) {
    console.error(error)
    stopPolling()
    loadingPpt.value = false
    ElMessage.error('查询任务状态失败')
  }
}

const generate = async () => {
  if (!formModel.title.trim()) {
    ElMessage.warning('请输入主题')
    return
  }
  stopPolling()
  loadingPpt.value = true
  jobStatus.value = ''
  progress.value = null
  pptId.value = ''
  recordDesc.value = ''
  summary.value = ''
  thumbnails.value = []
  selectedThumb.value = null
  try {
    const sources = formModel.sources
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const resp = await createPptMaster({
      title: formModel.title,
      pages: formModel.pages,
      lang: formModel.lang,
      canvas: formModel.canvas,
      images: formModel.images,
      sources,
      template: formModel.template || undefined,
      doc_name: formModel.title,
      user: uid()
    })
    if (resp && resp.jobId) {
      jobStatus.value = 'queued'
      pollTimer.value = setInterval(() => pollStatus(resp.jobId), 3000)
      pollStatus(resp.jobId)
    } else {
      loadingPpt.value = false
      ElMessage.warning('提交未返回 jobId')
    }
  } catch (error) {
    console.error(error)
    loadingPpt.value = false
    ElMessage.error('提交失败')
  }
}

onBeforeUnmount(() => stopPolling())

const loadThumbnails = async () => {
  if (!pptId.value) return
  try {
    const res = await getPPTThumbnailList({ pptId: pptId.value })
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
  if (!pptId.value) {
    ElMessage.warning('请先生成 PPT')
    return
  }
  try {
    const resp = await downloadPPT({ id: pptId.value })
    download.pptx(resp, (recordDesc.value || formModel.title || '课件') + '.pptx')
  } catch (error) {
    console.error(error)
    ElMessage.error('下载失败')
  }
}

const goEdit = () => {
  if (!pptId.value) {
    ElMessage.warning('请先生成 PPT')
    return
  }
  router.push({ path: '/digital/ppt-collabora', query: { pptId: pptId.value } })
}
</script>

<template>
  <div class="ppt-master">
    <div class="content" v-loading="loadingPpt">
      <!-- 输入区 -->
      <div class="step-panel">
        <div class="panel-title">输入主题，ppt-master 引擎一键生成原生可编辑 PPT</div>
        <el-form label-position="top">
          <el-form-item label="主题" required>
            <el-input
              v-model="formModel.title"
              placeholder="请输入 PPT 主题，例如：海豚的秘密"
              maxlength="100"
            />
          </el-form-item>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="页数">
                <el-input-number v-model="formModel.pages" :min="4" :max="30" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="画布">
                <el-select v-model="formModel.canvas" class="w-full">
                  <el-option value="ppt169" label="16:9" />
                  <el-option value="ppt43" label="4:3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="语言">
                <el-select v-model="formModel.lang" class="w-full">
                  <el-option value="zh-CN" label="中文" />
                  <el-option value="en" label="英文" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="图片">
                <el-select v-model="formModel.images" class="w-full">
                  <el-option value="none" label="原生 SVG（不搜图）" />
                  <el-option value="web" label="网页搜图" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模板">
                <el-select v-model="formModel.template" clearable placeholder="自由设计（默认）" class="w-full">
                  <el-option
                    v-for="t in templateOptions"
                    :key="t.value"
                    :value="t.value"
                    :label="t.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="素材来源（可选，每行一个本地路径或 URL）">
            <el-input
              v-model="formModel.sources"
              type="textarea"
              :rows="3"
              placeholder="例如：projects/spec.pdf&#10;https://example.com/article"
            />
          </el-form-item>
        </el-form>
        <div class="step-actions">
          <el-button type="primary" size="large" :disabled="loadingPpt" @click="generate">
            立即生成
          </el-button>
        </div>
      </div>

      <!-- 生成结果区 -->
      <div v-if="loadingPpt" class="generating">
        <el-icon class="is-loading" style="font-size: 28px"><Loading /></el-icon>
        <p>正在生成 PPT，通常需要几分钟，请稍后...</p>
        <p v-if="progress && progress.turn" class="progress-hint">已进行 {{ progress.turn }} 轮</p>
      </div>

      <div v-else-if="pptId" class="result-panel">
        <div class="ppt-toolbar">
          <div class="ppt-actions">
            <el-button type="primary" @click="onDownload">下载 PPT</el-button>
            <el-button type="primary" plain @click="goEdit">编辑</el-button>
            <el-button @click="generate">重新生成</el-button>
          </div>
          <div v-if="summary" class="ppt-summary">{{ summary }}</div>
        </div>

        <div v-if="thumbnails.length" class="ppt-preview">
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
        <el-empty v-else description="暂无预览图" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ppt-master {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.step-panel {
  max-width: 860px;
  margin: 0 auto;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
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

.progress-hint {
  font-size: 12px;
  color: #c0c4cc;
}

.result-panel {
  max-width: 1200px;
  margin: 24px auto 0;
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

.ppt-summary {
  color: #606266;
  font-size: 13px;
  max-width: 60%;
}

.ppt-preview {
  display: flex;
  gap: 16px;
}

.thumb-list {
  width: 180px;
  flex-shrink: 0;
  max-height: calc(100vh - 320px);
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
  max-height: calc(100vh - 340px);
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
</style>
