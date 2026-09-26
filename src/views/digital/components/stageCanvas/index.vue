<!-- Canvas -->
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { ClickOutside as vClickOutside } from 'element-plus'
import Konva from 'konva'
import type { Layer } from './type'
import { useGuides } from './useGuides'
import { useContextmenu } from './useContextmenu'
defineOptions({
  name: 'StageView'
})
const emits = defineEmits(['onItemClick', 'isReady'])
const props = defineProps({
  align: {
    type: String,
    values: ['HORIZONTAL', 'VERTICAL'],
    default: 'HORIZONTAL'
  },
  layers: {
    type: Array<Layer>,
    default: () => []
  }
})
const { align, layers } = toRefs(props)
const backImgUrl = ref('')
const bgVideoRef = ref<HTMLVideoElement | null>(null)
const canvasBoxWrapper = ref<HTMLDivElement>()
const layerView: Konva.Layer = new Konva.Layer()
let stageRef: Konva.Stage | null = null
let trRef: Konva.Transformer | null = null
let scaleR = 1
const videoViews: Array<{ id: string; video: HTMLVideoElement; animation: Konva.Animation }> = []
const bgVideoUrl = ref<string>('')
const wh = reactive({
  width: 0,
  height: 0
})
const imgStyle = computed(() => {
  return {
    width: wh.width / wh.height > 1 ? wh.width + 'px' : '',
    height: wh.width / wh.height < 1 ? wh.height + 'px' : ''
  }
})
const canvasStyle = computed(() => {
  return {
    width: wh.width + 'px',
    height: wh.height + 'px'
  }
})
watch(
  () => align.value,
  () => resizeHandler()
)
watch(
  () => bgVideoUrl.value,
  async () => {
    await nextTick()
    if (bgVideoRef.value) {
      bgVideoRef.value.src = bgVideoUrl.value
      bgVideoRef.value.load()
    }
  }
)

const resizeHandler = debounce(async () => {
  if (canvasBoxWrapper.value) {
    let Rect16_9, Rect9_16
    let style = getComputedStyle(canvasBoxWrapper.value)
    let width = parseFloat(style.width)
    let height = parseFloat(style.height)
    if (width < (16 / 9) * height) {
      Rect16_9 = [width, height * (width / ((16 / 9) * height))]
    } else {
      Rect16_9 = [(16 * height) / 9, height]
    }
    Rect9_16 = [(9 / 16) * height, height]
    // 3840x2160 4k  2560x1440 2k  1920x1080 1080p
    scaleR = 'HORIZONTAL' === align.value ? Number(Rect16_9[0]) / 1920 : Number(Rect9_16[0]) / 1080

    if ('HORIZONTAL' === align.value) {
      wh.width = Rect16_9[0]
      wh.height = Rect16_9[1]
    } else {
      wh.width = Rect9_16[0]
      wh.height = Rect9_16[1]
    }
    stageRef = new Konva.Stage({
      container: 'canvas',
      name: 'stage',
      width: wh.width,
      height: wh.height
    })
    stageRef.on('click', (e) => {
      // console.log('stage', e)
      if (e.target instanceof Konva.Stage) {
        console.log('click stage')
        if (layerView) {
          layerView.find('Transformer').map((t) => t.remove())
          // layerView.batchDraw()
        }
      }
    })
    stageRef.add(layerView)
    useGuides(stageRef, layerView).init()
    useContextmenu(stageRef, ({ id, type }) => {
      if (layers.value.length > 0) {
        const existingLayer = layers.value.find(
          (ite) => ite.name === id.replace('stageCanvas-', '')
        )
        if (existingLayer) {
          // if (existingLayer.type === 'video') {
          stopVideo(null)
          // }
        }

        if (type === 'delete') {
          if (existingLayer) {
            layers.value.splice(layers.value.indexOf(existingLayer), 1)
            if (existingLayer.type === 'video') {
              videoViews.splice(
                videoViews.findIndex((item) => item.id === id),
                1
              )
            }
          }

          return
        }
        if (type === 'moveToTop') {
          if (existingLayer) {
            layers.value.push(layers.value.splice(layers.value.indexOf(existingLayer), 1)[0])
          }
          return
        }
        if (type === 'moveToBottom') {
          if (existingLayer) {
            layers.value.unshift(layers.value.splice(layers.value.indexOf(existingLayer), 1)[0])
          }
          return
        }
        if (type === 'moveUp') {
          if (existingLayer) {
            const index = layers.value.indexOf(existingLayer)
            if (index < layers.value.length - 1) {
              layers.value.splice(index + 1, 0, layers.value.splice(index, 1)[0])
            }
          }
          return
        }
        if (type === 'moveDown') {
          if (existingLayer) {
            const index = layers.value.indexOf(existingLayer)
            if (index > 0) {
              layers.value.splice(index - 1, 0, layers.value.splice(index, 1)[0])
            }
          }
          return
        }
      }
    }).init()
    createTransformer()
    emits('isReady')
  }
}, 500)

const createVideo = () => {
  const videoView = document.createElement('video') as HTMLVideoElement
  videoView.src = ''
  videoView.muted = true
  videoView.playsInline = true
  videoView.crossOrigin = 'anonymous'
  return videoView
}
const createTransformer = () => {
  // add the shape to the layer
  trRef = new Konva.Transformer({
    keepRatio: false, // 是否保持宽高比
    rotateEnabled: false,
    anchorStroke: '#ffc828',
    anchorFill: '#ffc828',
    anchorSize: 10,
    borderStroke: '#ffc828',
    // boundBoxFunc: (oldBox, newBox) => {
    //   console.log(oldBox, newBox)
    //   return newBox
    // },
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
  })
}

const onItemClickListener = (e) => {
  layerView?.find('Transformer').map((item) => item.remove())
  if (e.target.id().includes('Human') || e.target.id().includes('Video')) {
    trRef?.setAttrs({
      keepRatio: true
    })
    if (e.target.id().includes('Video')) {
      const id = e.target.id().replace('stageCanvas-', '')
      const layer = layers.value.find((item) => item.name === id)
      if (layer) playVideo(layer)
    }
  } else {
    trRef?.setAttrs({
      keepRatio: false
    })
  }
  trRef?.nodes([e.target])
  if (trRef) layerView?.add(trRef)
  emits('onItemClick', e.target.id().replace('stageCanvas-', ''))
}
const setZIndex = ({ zIndex, type }: { zIndex: number; type: string }) => {
  if (!type) return
  let currentLayers = layerView?.children || []
  for (let index = 0; index < currentLayers.length; index++) {
    const item = currentLayers[index]
    if (item.id() === `stageCanvas-${type}`) {
      item.setZIndex(zIndex)
      break
    }
  }
}

const playVideo = (layer: Layer) => {
  if (!layer) return
  if (!layer.name.includes('Video')) return
  let currentLayers = layerView?.children || []
  const videoLayer = currentLayers.find(
    (item) => item.id() === `stageCanvas-${layer.name}`
  ) as Konva.Image
  if (videoLayer) {
    const viewObj = videoViews.find((item) => item.id === videoLayer.id())
    if (viewObj) {
      viewObj.video.play()
      if (viewObj.animation) {
        viewObj.animation.start()
      }
      return
    }
    const videoView = createVideo()
    const anim = new Konva.Animation(function () {
      videoLayer.draw()
    }, layerView)
    videoView.onloadedmetadata = () => {
      if (videoView) {
        videoLayer.width(videoView.videoWidth)
        videoLayer.height(videoView.videoHeight)
        videoView.currentTime = 0
      }
    }
    videoView.src = layer.src
    videoLayer.image(videoView)
    videoViews.push({
      id: videoLayer.id(),
      video: videoView,
      animation: anim
    })
    videoView.play()
    anim?.start()
  }
}
const stopVideo = (id) => {
  if (id) {
    const videoV = videoViews.find((item) => (item.id = id))
    if (videoV) {
      videoV.animation.stop()
      videoV.video.pause()
    }
  } else {
    videoViews.forEach((item) => {
      item.animation.stop()
      item.video.pause()
    })
  }
}
const getLayersData = (): Promise<Layer[]> => {
  return new Promise((resolve) => {
    let layerArray: any[] = []
    layerView?.children.forEach((item, index) => {
      const image = layers.value.find((value) => `stageCanvas-${value.name}` === item.id())
      let layer = {
        name: item.id().replace('stageCanvas-', ''),
        id: image?.id || '',
        x: item.x() / scaleR,
        y: item.y() / scaleR,
        width: item.width(),
        height: item.height(),
        src: image?.src,
        opacity: item.opacity() || 1,
        scaleWidth: (item.width() * item.scaleX()) / scaleR,
        scaleHeight: (item.height() * item.scaleY()) / scaleR,
        zIndex: index,
        visible: item.visible()
      }
      layerArray.push(layer)
    })
    if (backImgUrl.value) {
      const img = new Image()
      img.src = backImgUrl.value
      img.onload = () => {
        const bgItem = layers.value.find((layer) => layer.name === 'BackGround')
        layerArray.push({
          name: 'BackGround',
          id: bgItem?.id || '',
          src: bgItem?.src || '',
          type: bgItem?.type || '',
          x: 0,
          y: 0,
          scale: {
            x: wh.width / img.width,
            y: wh.height / img.height
          },
          width: img.width,
          height: img.height,
          scaleWidth: wh.width,
          scaleHeight: wh.height,
          visible: true,
          zIndex: -1
        })
        resolve(layerArray)
      }
    } else {
      resolve(layerArray)
    }
  })
}

const onItemFocus = (item: Layer) => {
  const curent = layerView?.children.find((ite) => ite.id() === `stageCanvas-${item.name}`)
  if (curent) {
    trRef?.nodes([curent])
    if (trRef) layerView?.add(trRef)
  }
}

const onItemDelete = (item: Layer) => {
  if (item.name === 'BackGround') {
    backImgUrl.value = ''
    bgVideoUrl.value = ''
    return
  }
  const currentLayers = layerView?.children || []
  let image = currentLayers.find((ite) => ite.id() === `stageCanvas-${item.name}`)
  image?.destroy()
  if (item.type === 'video') {
    const id = `stageCanvas-${item.name}`
    stopVideo(id)
    videoViews.splice(
      videoViews.findIndex((item) => item.id === id),
      1
    )
  }
}
const setOpacity = (item: Layer, opacity: number) => {
  const currentLayers = layerView?.children || []
  let image = currentLayers.find((ite) => ite.id() === `stageCanvas-${item.name}`)
  if (image) {
    image.opacity(opacity)
  }
}

const addLayer = async (item: Layer) => {
  let name = `stageCanvas-${item.name}`
  let config: ImageConfig = {
    src: item.src,
    onClickListener: onItemClickListener,
    image: undefined,
    visible: item.visible,
    opacity: item.opacity,
    id: name
  }
  config.x = (item.x ? item.x : 0) * scaleR
  config.y = (item.y ? item.y : 0) * scaleR

  if (item.scaleWidth && item.width && item.scaleHeight && item.height) {
    config.scale = {
      x: (item.scaleWidth * scaleR) / item.width,
      y: (item.scaleHeight * scaleR) / item.height
    }
  }
  try {
    await createImage(config)
  } catch (error) {
    console.log('error', error)
  }
}
const updateLayer = async (item: Layer) => {
  let name = `stageCanvas-${item.name}`
  let currentLayers = layerView?.children || []
  const image = currentLayers.find((m) => m.id() === name)
  if (!image) {
    return
  }
  const config: ImageConfig = {
    ...image.attrs,
    src: item.src,
    image: undefined,
    visible: item.visible,
    opacity: item.opacity,
    id: `stageCanvas-${item.name}`
  }
  try {
    await updateImage(config)
  } catch (error) {
    console.log('error', error)
  }
}

const setBackground = async (item: Layer) => {
  if (item.type === 'image') {
    bgVideoUrl.value = ''
    backImgUrl.value = item?.src || ''
  } else {
    bgVideoUrl.value = item.src
    backImgUrl.value = (await getVideoFirstFrame(item.src)) as string
  }
}
const setLayers = async (layers: Layer[]) => {
  let currentLayers = layerView?.children || []
  if (layers) {
    const bgItem = layers.find((layer) => layer.name === 'BackGround')
    if (bgItem) {
      setBackground(bgItem)
    }
    // 过滤掉 BackGround 图层
    const filteredLayers = layers.filter((layer) => layer.name !== 'BackGround')
    for (let index = 0; index < filteredLayers.length; index++) {
      const item = filteredLayers[index]
      let name = `stageCanvas-${item.name}`
      const image = currentLayers.find((m) => m.id() === name)
      if (!image) {
        let config: ImageConfig = {
          src: item.src,
          onClickListener: onItemClickListener,
          image: undefined,
          visible: item.visible,
          opacity: item.opacity,
          id: name
        }

        config.x = (item.x ? item.x : 0) * scaleR
        config.y = (item.y ? item.y : 0) * scaleR

        if (item.scaleWidth && item.width && item.scaleHeight && item.height) {
          config.scale = {
            x: (item.scaleWidth * scaleR) / item.width,
            y: (item.scaleHeight * scaleR) / item.height
          }
        }
        try {
          await createImage(config)
        } catch (error) {
          console.log('error', error)
        }
      } else {
        await updateImage({
          ...image.attrs,
          src: item.src,
          image: undefined,
          visible: item.visible,
          opacity: item.opacity,
          id: `stageCanvas-${item.name}`
        })
      }
    }
  }
}

type ImageConfig = Konva.ImageConfig & {
  src: string
  visible?: boolean
  dragmove?: (e) => void
  transform?: (e) => void
  onClickListener?: (e) => void
}
const updateImage = (config: ImageConfig) => {
  return new Promise(async (resolve) => {
    let currentLayers = layerView?.children || []
    var imageObj = new Image()
    imageObj.onload = function () {
      var imageLayer = currentLayers.find((m) => m.id() === config.id) as Konva.Image
      var zIndex = layers.value.findIndex(
        (layer) => layer.name === config.id?.replace('stageCanvas-', '')
      )

      imageLayer.visible(config.visible ?? true)
      imageLayer.opacity(config.opacity ?? 1)
      if (!imageLayer) return
      imageLayer.image(imageObj)
      if (zIndex > 0) imageLayer.setZIndex(zIndex)
      resolve(imageLayer)
    }
    imageObj.src =
      config.id && config.id.includes('Video')
        ? ((await getVideoFirstFrame(config.src)) as string)
        : config.src
  })
}
const createImage = async (config: ImageConfig) => {
  return new Promise(async (resolve) => {
    var imageObj = new Image()
    imageObj.onload = function () {
      const merge = {
        ...config,
        draggable: true,
        image: imageObj,
        visible: config.visible ?? true,
        opacity: config.opacity ?? 1
      }
      if (!config.scale || !config.scale.x || !config.scale.y) {
        let scaleX = wh.width / imageObj.width
        let scaleY = wh.height / imageObj.height
        let scale = Math.min(scaleX, scaleY)
        if (scale < 0.8) {
          scale = 0.8
        } else if (scale > 1) {
          scale = 1
          scaleX = 1
          scaleY = 1
        }
        merge.scale = {
          x: scaleX * scale,
          y: scaleY * scale
        }
        // 保持原图片比例
        if (merge.scale.x < merge.scale.y) {
          merge.scale.y = merge.scale.x
        } else {
          merge.scale.x = merge.scale.y
        }
      }
      let imageLayer = new Konva.Image(merge)
      layerView?.add(imageLayer)
      imageLayer.on('dragmove', (e) => config.dragmove && config.dragmove(e))
      imageLayer.on('transform', (e) => config.transform && config.transform(e))
      imageLayer.on('click', (e) => config.onClickListener && config.onClickListener(e))
      resolve(imageLayer)
    }
    imageObj.crossOrigin = 'anonymous'
    imageObj.onerror = function () {
      console.log('error', '图片加载失败')
      resolve(null)
    }
    imageObj.src =
      config.id && config.id.includes('Video')
        ? ((await getVideoFirstFrame(config.src)) as string)
        : config.src
  })
}

const getVideoFirstFrame = (videoUrl) => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      video.currentTime = 0
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageDataUrl = canvas.toDataURL('image/png')

      video.remove()
      resolve(imageDataUrl)
    }

    video.load()
  })
}

const handleClickOutside = () => {
  layerView?.find('Transformer').map((item) => item.remove())
}

onMounted(() => {
  // window.addEventListener('resize', resizeHandler)
  nextTick(() => {
    resizeHandler()
  })
})

onBeforeUnmount(() => {
  // window.removeEventListener('resize', resizeHandler)
})

defineExpose({
  addLayer,
  updateLayer,
  setLayers,
  setZIndex,
  getLayersData,
  onItemFocus,
  onItemDelete,
  setOpacity,
  playVideo,
  stopVideo,
  setBackground
})
</script>

<template>
  <div
    class="flex flex-1 select-none mt-10px mb-10px w-full h-full items-center justify-center"
    ref="canvasBoxWrapper"
  >
    <div class="relative flex">
      <div
        :style="canvasStyle"
        class="flex overflow-hidden items-center justify-center select-none bg-dark-50 rounded-4px"
      >
        <img
          v-if="backImgUrl && !bgVideoUrl"
          :src="backImgUrl"
          :style="imgStyle"
          width="100%"
          height="100%"
        />
        <video
          v-else
          ref="bgVideoRef"
          width="100%"
          height="100%"
          :autoplay="true"
          :loop="true"
          :muted="true"
          :playsinline="true"
        ></video>
      </div>
      <div class="absolute inset-0" id="canvas" v-click-outside="handleClickOutside"></div>
    </div>
  </div>
</template>
