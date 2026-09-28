<!--PPT 多页编辑器（Phase 1：fabric 画布编辑每页文字，增删页/排序/保存）-->
<script lang="ts" setup>
import { fabric } from 'fabric'
import { ElMessage } from 'element-plus'
import { Close, Picture, Upload } from '@element-plus/icons-vue'
import { getPPTThumbnailList, savePptEdit, regeneratePpt, uploadMaterial } from '@/api/digital'

defineOptions({ name: 'PptEdit' })

const router = useRouter()
const route = useRoute()

const CANVAS_W = 1280
const CANVAS_H = 720

const pptId = ref('')
const pages = ref<any[]>([])
const currentPage = ref(0)
const canvas = shallowRef<fabric.Canvas | null>(null)
const loading = ref(false)
const saving = ref(false)

// 属性面板绑定
const fontSize = ref(40)
const fillColor = ref('#333333')
const isBold = ref(false)

// 背景矩形引用，便于换背景色
let backgroundRect: fabric.Rect | null = null

const initCanvas = () => {
  const el = document.getElementById('ppt-canvas')
  if (!el) return
  const c = new fabric.Canvas('ppt-canvas', {
    width: CANVAS_W,
    height: CANVAS_H,
    selection: true,
    fireRightClick: false,
    stopContextMenu: true,
    preserveObjectStacking: true
  })
  // 画布自适应缩放
  const scale = Math.min((el.parentElement?.clientWidth || 900) / CANVAS_W, (el.parentElement?.clientHeight || 560) / CANVAS_H)
  c.setZoom(scale)
  canvas.value = c
  c.on('selection:created', syncAttr)
  c.on('selection:updated', syncAttr)
  c.on('selection:cleared', () => {
    fontSize.value = 40
    fillColor.value = '#333333'
    isBold.value = false
  })
  // 键盘删除
  document.addEventListener('keydown', onKeydown)
}

const onKeydown = (e: KeyboardEvent) => {
  if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.value) {
    const active = canvas.value.getActiveObject()
    if (active && active !== backgroundRect) {
      canvas.value.remove(active)
      canvas.value.discardActiveObject()
      canvas.value.requestRenderAll()
      e.preventDefault()
    }
  }
}

// 构建一页的 fabric 元素
const buildPageObjects = (page: any) => {
  backgroundRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: CANVAS_W,
    height: CANVAS_H,
    fill: page.bgColor || '#ffffff',
    selectable: false,
    evented: false
  })
  const objs: fabric.Object[] = [backgroundRect]
  if (page.title) {
    objs.push(
      new fabric.Textbox(page.title, {
        left: 80,
        top: 60,
        width: CANVAS_W - 160,
        fontSize: 44,
        fontWeight: 'bold',
        fill: '#222222',
        fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif'
      })
    )
  }
  if (page.bullets && page.bullets.length) {
    objs.push(
      new fabric.Textbox(page.bullets.map((b: string) => '• ' + b).join('\n'), {
        left: 80,
        top: 170,
        width: CANVAS_W - 160,
        fontSize: 26,
        fill: '#444444',
        fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
        lineHeight: 1.6
      })
    )
  }
  return objs
}

const loadPage = (idx: number) => {
  if (!canvas.value) return
  const page = pages.value[idx]
  if (!page) return
  canvas.value.clear()
  if (page.json) {
    canvas.value.loadFromJSON(page.json, () => {
      canvas.value!.requestRenderAll()
      backgroundRect = (canvas.value!.getObjects().find((o: any) => o.id === 'ppt-bg') as fabric.Rect) || null
      if (!backgroundRect) {
        backgroundRect = canvas.value!.getObjects().find((o: any) => o.type === 'rect') as fabric.Rect
      }
    })
  } else {
    const objs = buildPageObjects(page)
    backgroundRect = objs[0] as fabric.Rect
    backgroundRect.set('id', 'ppt-bg')
    objs.forEach((o) => canvas.value!.add(o))
    canvas.value.requestRenderAll()
  }
}

const saveCurrentPage = () => {
  if (!canvas.value) return
  const page = pages.value[currentPage.value]
  if (!page) return
  page.json = JSON.stringify(canvas.value.toJSON(['id']))
  page.thumb = canvas.value.toDataURL({ format: 'png', multiplier: 0.25 })
}

const switchPage = (idx: number) => {
  if (idx === currentPage.value || !canvas.value) return
  saveCurrentPage()
  currentPage.value = idx
  loadPage(idx)
}

const addPage = () => {
  saveCurrentPage()
  pages.value.push({ title: '', bullets: [], bgColor: '#ffffff', json: null, thumb: '' })
  currentPage.value = pages.value.length - 1
  loadPage(currentPage.value)
}

const deletePage = (idx: number) => {
  if (pages.value.length <= 1) {
    ElMessage.warning('至少保留一页')
    return
  }
  pages.value.splice(idx, 1)
  if (currentPage.value >= pages.value.length) currentPage.value = pages.value.length - 1
  loadPage(currentPage.value)
}

const movePage = (dir: number) => {
  const idx = currentPage.value
  const target = idx + dir
  if (target < 0 || target >= pages.value.length) return
  saveCurrentPage()
  const arr = pages.value
  ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
  currentPage.value = target
  loadPage(target)
}

// 属性面板
const syncAttr = () => {
  const obj = canvas.value?.getActiveObject() as any
  if (obj && obj.type === 'textbox') {
    fontSize.value = obj.fontSize || 40
    fillColor.value = obj.fill || '#333333'
    isBold.value = obj.fontWeight === 'bold'
  }
}

const applyFontSize = () => {
  const obj = canvas.value?.getActiveObject() as any
  if (obj && obj.type === 'textbox') {
    obj.set('fontSize', fontSize.value)
    canvas.value!.requestRenderAll()
  }
}

const applyColor = () => {
  const obj = canvas.value?.getActiveObject() as any
  if (obj && obj.type === 'textbox') {
    obj.set('fill', fillColor.value)
    canvas.value!.requestRenderAll()
  }
}

const toggleBold = () => {
  const obj = canvas.value?.getActiveObject() as any
  if (obj && obj.type === 'textbox') {
    isBold.value = !isBold.value
    obj.set('fontWeight', isBold.value ? 'bold' : 'normal')
    canvas.value!.requestRenderAll()
  }
}

const addText = () => {
  const t = new fabric.Textbox('双击编辑文字', {
    left: 100,
    top: 300,
    width: 500,
    fontSize: 28,
    fill: '#333333',
    fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif'
  })
  canvas.value!.add(t)
  canvas.value!.setActiveObject(t)
  canvas.value!.requestRenderAll()
}

// 背景色
const bgColor = ref('#ffffff')
const applyBgColor = () => {
  if (backgroundRect) {
    backgroundRect.set('fill', bgColor.value)
    canvas.value!.requestRenderAll()
  }
}

// 插入图片
const insertImage = (url: string) => {
  fabric.Image.fromURL(url, (img) => {
    if (!canvas.value) return
    if (img.width && img.width > 400) {
      img.scaleToWidth(400)
    }
    img.set({ left: 200, top: 200 })
    canvas.value.add(img)
    canvas.value.setActiveObject(img)
    canvas.value.requestRenderAll()
  })
}

// 上传图片（换图）
const onImageUpload = (file: any) => {
  const formData = new FormData()
  formData.append('file', file.raw, file.name)
  formData.append('bgShare', '0')
  formData.append('type', '1')
  uploadMaterial(formData).then((res: any) => {
    const url = res?.data?.url || res?.url || ''
    if (url) insertImage(url)
    else ElMessage.error('图片上传失败')
  })
}

// 上传背景图
const onBgUpload = (file: any) => {
  const formData = new FormData()
  formData.append('file', file.raw, file.name)
  formData.append('bgShare', '0')
  formData.append('type', '1')
  uploadMaterial(formData).then((res: any) => {
    const url = res?.data?.url || res?.url || ''
    if (!url) {
      ElMessage.error('背景图上传失败')
      return
    }
    fabric.Image.fromURL(url, (img) => {
      if (!canvas.value) return
      img.set({ left: 0, top: 0, width: CANVAS_W, height: CANVAS_H, selectable: false, evented: false, id: 'ppt-bg-img' })
      canvas.value.getObjects().forEach((o: any) => {
        if (o.id === 'ppt-bg-img') canvas.value!.remove(o)
      })
      canvas.value.add(img)
      canvas.value.sendToBack(img)
      canvas.value.requestRenderAll()
    })
  })
}

const buildSlidesPayload = () => {
  saveCurrentPage()
  return pages.value.map((p) => ({
    json: p.json || JSON.stringify({ objects: buildPageObjects(p).map((o: any) => o.toObject(['id'])) })
  }))
}

const save = async () => {
  if (!pptId.value) return
  saving.value = true
  try {
    const slides = buildSlidesPayload()
    await savePptEdit({
      pptId: pptId.value,
      slides: slides.map((s, i) => ({ pptNum: i, content: s.json }))
    })
    // 重新生成 pptx
    await regeneratePpt({
      pptId: pptId.value,
      templateId: '0',
      title: '',
      slides: slides.map((s) => s.json)
    })
    ElMessage.success('保存成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  pptId.value = (route.query.pptId as string) || ''
  loading.value = true
  try {
    if (pptId.value) {
      const res = await getPPTThumbnailList({ pptId: pptId.value })
      if (res && res.length) {
        pages.value = res.map((item: any) => {
          let title = ''
          let bullets: string[] = []
          try {
            const c = JSON.parse(item.ppt_slide_content || '{}')
            title = c.title || ''
            bullets = c.bullets || []
          } catch (e) {
            // 忽略解析失败
          }
          return { title, bullets, bgColor: '#ffffff', json: null, thumb: item.ppt_image_url || '' }
        })
      }
    }
    if (!pages.value.length) {
      pages.value = [{ title: '', bullets: [], bgColor: '#ffffff', json: null, thumb: '' }]
    }
  } catch (error) {
    console.error(error)
    pages.value = [{ title: '', bullets: [], bgColor: '#ffffff', json: null, thumb: '' }]
  } finally {
    loading.value = false
    initCanvas()
    loadPage(0)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  canvas.value?.dispose()
})
</script>

<template>
  <div class="ppt-edit" v-loading="loading">
    <!-- 左：页列表 -->
    <div class="page-list">
      <div class="page-list-actions">
        <el-button type="primary" size="small" @click="addText">+ 文字</el-button>
        <el-button size="small" @click="addPage">+ 加页</el-button>
      </div>
      <div class="page-list-scroll">
        <div
          v-for="(p, i) in pages"
          :key="i"
          class="page-item"
          :class="{ active: i === currentPage }"
          @click="switchPage(i)"
        >
          <img v-if="p.thumb" :src="p.thumb" />
          <div v-else class="page-item-empty">{{ i + 1 }}</div>
          <span class="page-num">{{ i + 1 }}</span>
          <el-icon class="page-del" @click.stop="deletePage(i)"><Close /></el-icon>
        </div>
      </div>
      <div class="page-list-actions">
        <el-button size="small" @click="movePage(-1)">上移</el-button>
        <el-button size="small" @click="movePage(1)">下移</el-button>
      </div>
    </div>

    <!-- 中：画布 -->
    <div class="canvas-wrap">
      <canvas id="ppt-canvas"></canvas>
    </div>

    <!-- 右：属性面板 -->
    <div class="attr-panel">
      <div class="attr-title">文本样式</div>
      <div class="attr-row">
        <span>字号</span>
        <el-input-number v-model="fontSize" :min="10" :max="200" size="small" @change="applyFontSize" />
      </div>
      <div class="attr-row">
        <span>颜色</span>
        <el-color-picker v-model="fillColor" @change="applyColor" />
      </div>
      <div class="attr-row">
        <span>粗体</span>
        <el-button size="small" :type="isBold ? 'primary' : 'default'" @click="toggleBold">B</el-button>
      </div>

      <div class="attr-title" style="margin-top: 16px">背景</div>
      <div class="attr-row">
        <span>背景色</span>
        <el-color-picker v-model="bgColor" @change="applyBgColor" />
      </div>
      <div class="attr-row">
        <span>背景图</span>
        <el-upload :show-file-list="false" :before-upload="(f: any) => { onBgUpload(f); return false }" accept="image/*">
          <el-button size="small" :icon="Upload">上传</el-button>
        </el-upload>
      </div>

      <div class="attr-title" style="margin-top: 16px">图片</div>
      <div class="attr-row">
        <el-upload :show-file-list="false" :before-upload="(f: any) => { onImageUpload(f); return false }" accept="image/*">
          <el-button size="small" :icon="Picture">插入图片</el-button>
        </el-upload>
      </div>
    </div>

    <!-- 顶：保存 -->
    <div class="top-bar">
      <el-button @click="router.back()">返回</el-button>
      <el-button type="primary" :loading="saving" @click="save">保存</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ppt-edit {
  position: relative;
  display: flex;
  height: calc(100vh - 60px);
  padding-top: 50px;
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.page-list {
  width: 140px;
  flex-shrink: 0;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.page-list-actions {
  display: flex;
  gap: 6px;
  padding: 8px;
}

.page-list-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.page-item {
  position: relative;
  margin-bottom: 10px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}

.page-item.active {
  border-color: #409eff;
}

.page-item img {
  width: 100%;
  display: block;
}

.page-item-empty {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
}

.page-num {
  position: absolute;
  left: 4px;
  top: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 3px;
}

.page-del {
  position: absolute;
  right: 4px;
  top: 4px;
  color: #f56c6c;
  cursor: pointer;
}

.canvas-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  overflow: hidden;
}

.attr-panel {
  width: 200px;
  flex-shrink: 0;
  border-left: 1px solid #eee;
  padding: 12px;
}

.attr-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.attr-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>
