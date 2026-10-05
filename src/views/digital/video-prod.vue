<!--视频制作-->
<script lang="ts" setup>
import { saveVideo, saveTrainVideo, saveLiveVideo, getVideoDetail, saveThumbnailDesc, createVoiceApi } from '@/api/digital'
import type { Layer, StageViewHtml } from './components/stageCanvas/type'
import type { ThumbnailItem } from './components/ppt/ThumbnailList.vue'
import { DSideBarPane, StageView, LayersBox, ThumbnailList, VoiceModal } from './components'
import { getTextManageListPage, getFirstPptImageByCopywriteId } from "@/api/digital";
const props = withDefaults(defineProps<{
  soureType?: string
  pptInfo?: { pptId?: string; copyrightId?: string; pptName?: string }
}>(), {
  soureType: '1',
  pptInfo: undefined
})
const { soureType, pptInfo } = toRefs(props);

const { query } = useRoute()
const dialogVisible = ref(false)
const isReadonly = ref(false)
const videoName = ref('未命名草稿')
const formData = reactive({
  id: '',
  videoName: '未命名草稿', // 视频名称
  copywriteId: '', // 文案id
  copywritePptId: '', // PPT id
  humanId: '', // 数字人id
  voiceId: '', // 声音id
  resolutionRatio: '1080P', // 分辨率
  aspectRatio: 'HORIZONTAL', // 画面比例
  characterPosition: 'right', // 人物位置
  captionsPosition: '', // 字幕位置
  isCaptions: false, // 是否字幕  1：是，0：否',
  isHuman: true, // 人物是否出镜
  isPpt: '', // 是否PPT为背景 1：是，0：否',
  isBg: '', // 是否背景图片 1：是，0：否',
  videoSave: '0', // 0:草稿 1:正式保存
  bgId: '' // 背景图片id
})
const opacity = ref(100)
const currentLayerName = ref<string>()
const router = useRouter()
const layers = ref<Layer[]>([])
const selectedVoiceName = ref('')
const speedFactor = ref(1.0)
const loadingVoice = ref(false)
// 图层类型：1-数字人，2-前景，3-PPT，4-对话Agent，5-互动画布容器
const LAYER_TYPE = {
  Human: 1,
  PPT: 3,
  Image: 2,
  Video: 2,
  BackGround: 6
}
const loading = ref(false)
const stageView = ref<StageViewHtml>()

const aspectRatioOptions = ref([
  { label: '16:9', value: 'HORIZONTAL' },
  { label: '9:16', value: 'VERTICAL' }
])

const commit = () => {
  if (videoName.value) formData.videoName = videoName.value
  else formData.videoName = '未命名草稿'
  dialogVisible.value = false
}
const pushLayers = (layer: Layer) => {
  currentLayerName.value = layer.name
  const curData = layers.value.find((item) => item.name === layer.name)
  if (curData) {
    curData.src = layer.src
    curData.visible = layer.visible
    curData.opacity = layer.opacity
    curData.id = layer.id;
    if (layer.title !== undefined) {
      curData.title = layer.title
    }
    if (layer.name === 'BackGround') {
      stageView.value?.setBackground(layer)
      return
    }
    stageView.value?.updateLayer(curData)
  } else {
    if (layer.name === 'BackGround') {
      layers.value.unshift({
        ...layer,
        src: layer.src
      })
      stageView.value?.setBackground(layer)
      return
    }
    layers.value.push({
      ...layer,
      src: layer.src
    })
    stageView.value?.addLayer({
      ...layer,
      src: layer.src
    })
  }
}

const delLayer = (item: Layer) => {
  if (item.name === 'Human') {
    formData.humanId = ''
  }
  if (item.name === 'PPT') {
    formData.copywriteId = ''
  }
  if (item.name === 'BackGround') {
    formData.bgId = ''
  }
  stageView.value?.onItemDelete(item)
  const index = layers.value.findIndex((ite) => ite.id === item.id)
  if (index !== -1) {
    layers.value.splice(index, 1)
  }
}
const delVoice = () => {
  formData.voiceId = ''
  selectedVoiceName.value = ''
}
const onItemClick = (item: any) => {
  if (item.copywriteId) {
    formData.copywriteId = item.copywriteId
    formData.copywritePptId = item.mainPptId
    pushLayers({
      id: item.copywriteId,
      src: item.imageUrl,
      name: 'PPT',
      title: item.copywriteTitle,
      delete: false,
      type: 'image'
    })
    if (item.copywriteTitle) {
      formData.videoName = item.copywriteTitle
      videoName.value = item.copywriteTitle
    }
  }

  console.log('formData', formData)
  console.log('item', item)
  if (item.copywritePptId) formData.copywritePptId = item.copywritePptId
  if (item.voiceId) {
    formData.voiceId = item.voiceId
    selectedVoiceName.value = item.voiceName || ''
  }
  if (item.humanId) {
    formData.humanId = item.humanId
    pushLayers({
      id: item.humanId,
      src: item.humanImageUrl,
      name: 'Human',
      title: item.humanName,
      delete: false,
      type: 'image'
    })
  }
  if (item.backImgId) {
    formData.bgId = item.backImgId
    pushLayers({
      id: item.backImgId,
      src: item.src,
      name: 'BackGround',
      title: item.name,
      delete: false,
      type: item.type === 'image' ? 'image' : 'video'
    })
  }
  if (item.materialId) {
    // formData.materialId = item.materialId
    const name = item.type === 'image' ? 'Image' : 'Video'
    const count = layers.value
      .filter((item) => item.name.includes(name))
      .map((item) => Number(item.name.split('-')[1]))
    const countNum = count.length === 0 ? 1 : Math.max(...count) + 1
    const existingLayer = layers.value.find((ite) => ite.id === item.materialId)
    if (existingLayer) {
      console.log('Layer with the same id already exists:', existingLayer)
      return
    }
    pushLayers({
      id: item.materialId,
      src: item.url,
      name: `${name}-${countNum}`,
      title: item.name,
      delete: false,
      type: item.type === 'image' ? 'image' : 'video'
    })
  }
}

const commitVideo = async (videoSave: String) => {
  // show Loading
  loading.value = true
  const layers = await stageView.value?.getLayersData()
  if (!layers || layers.length === 0) {
    ElMessage.error('请先添加素材')
    loading.value = false
    return
  }
  const layerInfo = layers.map((item) => {
    const type = item.name.includes('Image')
      ? 'Image'
      : item.name.includes('Video')
        ? 'Video'
        : item.name
    let layerType = LAYER_TYPE[type] + ''
    if (item.name === 'BackGround' && item.type === 'video') {
      layerType = '7'
    }
    return {
      layerName: item.name,
      layerType: layerType,
      layerTypeId: item.id + '',
      layerLock: '1',
      layerOrder: item.zIndex + '',
      width: item.width + '',
      height: item.height + '',
      opacity: item.opacity + '',
      boxx: item.x + '',
      boxy: item.y + '',
      boxw: item.scaleWidth + '',
      boxh: item.scaleHeight + '',
      isShow: item.visible ? '1' : '0',
      src: item.src
    }
  })
  try {
    const resp = await saveVideo({
      ...formData,
      aspectRatio: formData.aspectRatio === 'HORIZONTAL' ? '16:9' : '9:16',
      videoSave: videoSave,
      isCaptions: formData.isCaptions ? '1' : '0',
      isHuman: formData.isHuman ? '1' : '0',
      isPpt: '1',
      layerInfo: layerInfo
    })
    if (resp) {
      formData.id = resp.id
      if (videoSave === '1') {
        ElMessage.success('提交成功')
        router.push('/digital/video-mgmt')
      } else {
        ElMessage.success('保存成功')
        // router.push('/digital/video-mgmt')
      }
    }
    loading.value = false
  } catch (error) {
    ElMessage.error('提交失败')
    loading.value = false
    console.log(error)
  }
}

const commitLiveVideo = async (mainId: String) => {
  // show Loading
  loading.value = true
  const layers = await stageView.value?.getLayersData()
  if (!layers || layers.length === 0) {
    ElMessage.error('请先添加素材')
    loading.value = false
    return
  }
  const layerInfo = layers.map((item) => {
    const type = item.name.includes('Image')
      ? 'Image'
      : item.name.includes('Video')
        ? 'Video'
        : item.name
    let layerType = LAYER_TYPE[type] + ''
    if (item.name === 'BackGround' && item.type === 'video') {
      layerType = '7'
    }
    return {
      layerName: item.name,
      layerType: layerType,
      layerTypeId: item.id + '',
      layerLock: '1',
      layerOrder: item.zIndex + '',
      width: item.width + '',
      height: item.height + '',
      opacity: item.opacity + '',
      boxx: item.x + '',
      boxy: item.y + '',
      boxw: item.scaleWidth + '',
      boxh: item.scaleHeight + '',
      isShow: item.visible ? '1' : '0',
      src: item.src
    }
  })
  try {
    const resp = await saveLiveVideo({
      ...formData,
      aspectRatio: formData.aspectRatio === 'HORIZONTAL' ? '16:9' : '9:16',
      videoSave: 1,
      isCaptions: formData.isCaptions ? '1' : '0',
      isHuman: formData.isHuman ? '1' : '0',
      isPpt: '1',
      layerInfo: layerInfo,
      liveId: mainId
    })
    if (resp) {
      formData.id = resp.id
      ElMessage.success('提交成功')
    }
    loading.value = false
  } catch (error) {
    ElMessage.error('提交失败')
    loading.value = false
    console.log(error)
  }
}

const commitTrainVideo = async (mainId: String) => {
  // show Loading
  loading.value = true
  const layers = await stageView.value?.getLayersData()
  if (!layers || layers.length === 0) {
    ElMessage.error('请先添加素材')
    loading.value = false
    return
  }
  const layerInfo = layers.map((item) => {
    const type = item.name.includes('Image')
      ? 'Image'
      : item.name.includes('Video')
        ? 'Video'
        : item.name
    let layerType = LAYER_TYPE[type] + ''
    if (item.name === 'BackGround' && item.type === 'video') {
      layerType = '7'
    }
    return {
      layerName: item.name,
      layerType: layerType,
      layerTypeId: item.id + '',
      layerLock: '1',
      layerOrder: item.zIndex + '',
      width: item.width + '',
      height: item.height + '',
      opacity: item.opacity + '',
      boxx: item.x + '',
      boxy: item.y + '',
      boxw: item.scaleWidth + '',
      boxh: item.scaleHeight + '',
      isShow: item.visible ? '1' : '0',
      src: item.src
    }
  })
  try {
    const resp = await saveTrainVideo({
      ...formData,
      aspectRatio: formData.aspectRatio === 'HORIZONTAL' ? '16:9' : '9:16',
      videoSave: 1,
      isCaptions: formData.isCaptions ? '1' : '0',
      isHuman: formData.isHuman ? '1' : '0',
      isPpt: '1',
      layerInfo: layerInfo,
      trainId: mainId
    })
    if (resp) {
      formData.id = resp.id
      ElMessage.success('提交成功')
    }
    loading.value = false
  } catch (error) {
    ElMessage.error('提交失败')
    loading.value = false
    console.log(error)
  }
}

defineExpose({ commitLiveVideo , commitTrainVideo})

const onLayerItemClick = (item: Layer) => {
  currentLayerName.value = item.name
  if (item.opacity) {
    opacity.value = item.opacity * 100
  }
  stageView.value?.onItemFocus(item)
}

const onStageItemClick = (name: string) => {
  currentLayerName.value = name
  const humanLayer = layers.value.find((item) => item.name === name)
  if (humanLayer && humanLayer.opacity) {
    opacity.value = humanLayer.opacity * 100
  } else {
    opacity.value = 100
  }
}
const getCoverUrl = async (id: string) => {
  const resp = await getFirstPptImageByCopywriteId({ copywriteId: id })
  return resp.imageData
}
const templateLayer = ref<Layer[]>([])
onMounted(async () => {
  console.log("this is props----------------->:"+JSON.stringify(props));

  // 获取参数 id（编辑已有视频时才带 id，新建「立即制作」跳过）
  if (query.id) {
    const resp = await getVideoDetail({ id: query.id })
    if (resp) {
      //formData.copywriteId = resp.copywriteId
      //formData.copywritePptId = resp.copywritePptId
      // formData.copywriteId = props.pptInfo.copyrightId
      // formData.copywritePptId = props.pptInfo.pptId
      //formData.copywriteId = '1742900785041738'
      //formData.copywritePptId = '1742900785041738'
      formData.id = query.id as string
      formData.videoName = resp.videoName
      if (props.pptInfo && props.pptInfo.copyrightId) {
        formData.copywriteId = props.pptInfo.copyrightId
      }
      if (props.pptInfo && props.pptInfo.pptId) {
        formData.copywritePptId = props.pptInfo.pptId
      }
      // copywritePptId : props.pptInfo.pptId
      formData.humanId = resp.humanId
      formData.voiceId = resp.voiceId
      formData.resolutionRatio = resp.resolutionRatio
      formData.aspectRatio = resp.aspectRatio && resp.aspectRatio === '16:9' ? 'HORIZONTAL' : 'VERTICAL'
      formData.characterPosition = resp.characterPosition
      formData.captionsPosition = resp.captionsPosition
      formData.isCaptions = resp.isCaptions
      formData.isHuman = resp.isHuman === '1' ? true : false
      formData.isPpt = resp.isPpt
      formData.isBg = resp.isBg
      formData.videoSave = resp.videoSave;
      // console.log(22222);
      const firstPPTImage = props.pptInfo && props.pptInfo.copyrightId ? await getCoverUrl(props.pptInfo.copyrightId) : ''
      resp.layerRspInfo.forEach(item => {
        if(item.layerName == 'PPT'){
          item.src = firstPPTImage
        }
      });
      templateLayer.value = resp.layerRspInfo.map((item) => {
        return {
          name: item.layerName,
          id: item.layerTypeId,
          src: item.src,
          visible: item.isShow === '1' ? true : false,
          opacity: parseFloat(item.opacity) || 1,
          scaleWidth: parseFloat(item.boxw),
          scaleHeight: parseFloat(item.boxh),
          width: parseFloat(item.width),
          height: parseFloat(item.height),
          x: parseFloat(item.boxx),
          y: parseFloat(item.boxy),
          zIndex: parseFloat(item.layerOrder),
          type: item.layerName.includes('Video') || item.layerType === '7' ? 'video' : 'image'
        }
      })
    }
  }
})
// PPT 名称回填为视频默认名（仍可在名称弹窗中修改）
watch(
  () => pptInfo.value?.pptName,
  (name) => {
    if (name && formData.videoName === '未命名草稿') {
      formData.videoName = name
      videoName.value = name
    }
  }
)
watch(
  () => formData.isHuman,
  (newVal) => {
    const humanLayer = layers.value.find((item) => item.name === 'Human')
    if (humanLayer) {
      pushLayers({
        ...humanLayer,
        visible: newVal
      })
    }
  }
)
watch(
  () => opacity.value,
  (newVal) => {
    const humanLayer = layers.value.find((item) => item.name === currentLayerName.value)
    if (humanLayer) {
      stageView.value?.setOpacity(humanLayer, newVal / 100)
    }
  }
)
const thumbnailData = ref<ThumbnailItem>({
  id: 0,
  url: '',
  desc: '',
  voiceUrl: ''
})
const desLoading = ref(false)
const onThumbnailItemClick = (item: ThumbnailItem) => {
  thumbnailData.value = item
  pushLayers({
    id: formData.copywriteId,
    src: item.url,
    name: 'PPT',
    delete: false,
    type: 'image'
  })
}
const saveThumbnail = async () => {
  desLoading.value = true
  try {
    const resp = await saveThumbnailDesc({
      pptNum: thumbnailData.value.id,
      pptId: formData.copywriteId,
      pptImageWords: thumbnailData.value.desc
    })
    if (resp) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    desLoading.value = false
  }
}
const createVoice = async () => {
  if (!formData.voiceId) {
    ElMessage.error('请先选择语音')
    return
  }

  loadingVoice.value = true
  const params = {
    voiceId: formData.voiceId,
    voiceType: '3',
    pptId: formData.copywriteId,
    pptNum: thumbnailData.value.id,
    speedFactor: speedFactor.value,
    pptImageWords: thumbnailData.value.desc
  }
  const resp = await createVoiceApi(params).catch((e) => {
    loadingVoice.value = false
    console.log(e)
  })
  if (resp) {
    thumbnailData.value.voiceUrl = resp
    ElMessage.success('创建成功')
  }
  loadingVoice.value = false
}

const playVideo = () => {
  const current = layers.value.find((item) => item.name === currentLayerName.value)
  if (current) stageView.value?.playVideo(current)
}
const stopVideo = () => {
  stageView.value?.stopVideo()
}
const onLayerChange = (startIndex, endIndex) => {
  const array = layers.value.filter((item) => item.name !== 'BackGround')
  const current = array[startIndex]
  stageView.value?.setZIndex({ type: current.name, zIndex: endIndex })
}

// 监听 stageReady 和 templateLayer.value
watch(
  () => [isReadonly.value, templateLayer.value],
  () => {
    if (isReadonly.value && templateLayer.value.length > 0) {
      layers.value = [...templateLayer.value]
      stageView.value?.setLayers(layers.value)
    }
  }
)
</script>

<template>
  <div v-loading="loading" class="min-w-1000px">
    <div class="flex justify-between items-center h-40px shadow-sm"  v-if="soureType != '2' && soureType != '3'">
      <div @click="dialogVisible = true" class="text-#666666 cursor-pointer">
        <span>{{ formData.videoName }}</span>
        <Icon icon="system-uicons:write" :size="16" class="ml-2" color="#409eff" />
      </div>
      <div class="flex items-center gap-4">
        <el-button size="small" @click="commitVideo('0')">保存草稿</el-button>
        <el-button size="small" type="primary" @click="commitVideo('1')">立即制作</el-button>
      </div>
    </div>

    <div class="flex gap-20px bg-#F3FAFD">
      <div class="flex flex-col w-200px min-w-200px">
        <ThumbnailList
          v-if="formData.copywriteId"
          :copywriteId="formData.copywritePptId"
          @on-item-click="onThumbnailItemClick"
        />
        <LayersBox
          class="flex-1"
          v-model:layers="layers"
          :voice-name="selectedVoiceName"
          @on-item-click="onLayerItemClick"
          @on-item-del="delLayer"
          @on-voice-del="delVoice"
          @change="onLayerChange"
        />
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex items-center h-40px gap-4 mt-3 justify-center">
          <el-select
            class="!w-160px"
            v-model="formData.resolutionRatio"
            size="small"
            placeholder="分辨率"
          >
            <el-option label="1080P" value="1080P" />
            <el-option label="2K" value="2K" />
            <el-option label="4K" value="4K" />
          </el-select>
          <el-select
            class="!w-160px"
            v-model="formData.aspectRatio"
            size="small"
            placeholder="画面比例"
          >
            <el-option
              v-for="item in aspectRatioOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="w-full h-full flex flex-col items-center">
          <StageView
            :align="formData.aspectRatio"
            :layers="layers"
            ref="stageView"
            @is-ready="() => (isReadonly = true)"
            @on-item-click="onStageItemClick"
          />
        </div>
        <div class="flex h-48% p-10px flex-col bg-white rounded-1">
          <div class="flex h-40px w-full gap-20px">
            <div class="flex items-center text-#666666 text-12px">
              <span
                ><label class="pr-2">是否出镜</label><el-switch v-model="formData.isHuman"
              /></span>
            </div>
            <div class="flex items-center gap-4 text-#666666 text-12px w-200px">
              <span class="whitespace-nowrap">透明度</span>
              <el-slider v-model="opacity" :min="0" :max="100" :show-tooltip="false" />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex h-40px w-full items-center">
              <h3 class="text-16px font-semibold">播报内容</h3>
            </div>
            <div class="flex h-40px w-full items-center gap-4">
<!--              <el-button size="small" type="primary">AI帮写</el-button>-->
<!--              <el-button size="small" type="primary" @click="saveThumbnail" v-loading="desLoading"-->
<!--                >保存</el-button-->
<!--              >-->
              <div class="flex items-center gap-4 text-#666666 text-12px">
                <span class="whitespace-nowrap">语速</span>
                <el-input-number v-model="speedFactor" size="small" :min="0.1" :step="0.1" />
              </div>
              <div class="flex items-center gap-4 text-#666666 text-12px">
                <el-button size="small" type="primary" :loading="loadingVoice" @click="createVoice"
                  >生成语音</el-button
                >
                <VoiceModal v-if="thumbnailData.voiceUrl" :url="thumbnailData.voiceUrl" />
              </div>
            </div>
            <div class="flex w-full">
              <el-input
                :disabled="desLoading"
                v-model="thumbnailData.desc"
                type="textarea"
                rows="4"
                placeholder="请输入内容"
                class="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
      <DSideBarPane
        class="w-315px overflow-hidden min-w-315px"
        @on-click="onItemClick"
        :data="formData"
        :pptId="props.pptInfo?.pptId"
      />
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="编辑" width="30%">
    <el-form>
      <el-form-item label="视频名称">
        <el-input v-model="videoName" placeholder="" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="commit">确 定</el-button>
    </template>
  </el-dialog>
</template>
