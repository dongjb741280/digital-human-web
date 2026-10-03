<!--Collabora Online 在线编辑 PPT（替换 fabric 画布编辑器）-->
<script lang="ts" setup>
import { openPptEdit, renderPreview } from '@/api/digital'

defineOptions({ name: 'PptCollabora' })

const router = useRouter()
const route = useRoute()

// Collabora impress(pptx) 编辑地址。hash 是 CODE 构建号（升级 CODE 镜像后需同步更新）。
// 直接硬编码，不 fetch discovery：CODE 未开 CORS，浏览器跨域 fetch 会被拦（Failed to fetch）。
// iframe 的 src 不受 CORS 限制，可直接加载。
const CODE_EDIT_URL = 'http://localhost:9980/browser/201368fc8d/cool.html?'

const loading = ref(false)
const error = ref('')
const frameSrc = ref('')

async function init() {
  const pptId = route.query.pptId as string
  if (!pptId) {
    error.value = '缺少 pptId 参数'
    return
  }
  loading.value = true
  try {
    const resp: any = await openPptEdit({ pptId, user: 'user' })
    const wopiSrc = resp?.wopiSrc
    if (!wopiSrc) throw new Error('未获取到 wopiSrc')
    frameSrc.value = `${CODE_EDIT_URL}WOPISrc=${encodeURIComponent(wopiSrc)}`
  } catch (e: any) {
    error.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

const goingBack = ref(false)

async function goBack() {
  const pptId = route.query.pptId as string
  if (pptId) {
    goingBack.value = true
    try {
      await renderPreview({ pptId })
    } catch (e) {
      console.error(e)
    } finally {
      goingBack.value = false
    }
  }
  router.back()
}

onMounted(init)
</script>

<template>
  <div class="ppt-collabora">
    <div class="toolbar">
      <el-button :loading="goingBack" @click="goBack">返回</el-button>
      <span class="hint">Collabora 在线编辑 · 保存后直接写回原 .pptx</span>
    </div>
    <div v-loading="loading" class="frame-wrap">
      <iframe v-if="frameSrc" :src="frameSrc" class="collabora-frame" />
      <el-empty v-else-if="error" :description="error" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ppt-collabora {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.toolbar {
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.hint {
  color: #909399;
  font-size: 13px;
}

.frame-wrap {
  flex: 1;
  min-height: 0;
  position: relative;
}

.collabora-frame {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
