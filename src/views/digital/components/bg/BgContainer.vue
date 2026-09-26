<!-- 背景 -->
<script lang="ts" setup>
import type { UploadFile } from 'element-plus'
import { uploadBackground, getBackgroundList, deleteBackground } from '@/api/digital'
defineOptions({
  name: 'BgContainer'
})
type bgItem = UploadFile & {
  showDelete: boolean
}
const emit = defineEmits(['onClick'])
const porps = defineProps({
  className: {
    type: [String, Object, Array],
    default: () => {
      return {}
    }
  },
  align: {
    type: String,
    default: 'left'
  },
  type: {
    type: String,
    default: '' // 请求类型 比如： 我的克隆、公共库
  },
  id: {
    type: String,
    default: '-1'
  }
})

const selectId = ref(porps.id)
const activeTab = ref('image')
const imageList = ref<bgItem[]>([])
const videoList = ref<bgItem[]>([])
const currentList = computed(() => {
  return activeTab.value === 'image' ? imageList.value : videoList.value
})
watch(
  () => porps.id,
  (newVal) => {
    selectId.value = newVal
  }
)

watch(
  () => activeTab.value,
  (newVal) => {
    getBackgroundListPage()
  }
)
const onItemClick = (item: bgItem) => {
  selectId.value = item.uid + ''
  emit('onClick', {
    backImgId: item.uid,
    src: item.url,
    type: activeTab.value
  })
}
const uploadProgress = ref(0)
const onChange = async (file: bgItem) => {
  const isImage = file.raw?.type.startsWith('image/')
  const isVideo = file.raw?.type.startsWith('video/')
  if (isImage && activeTab.value === 'image' && file.status === 'ready') {
    console.log('ready')
    uploadProgress.value = 0
    file.url = fileToUrl(file)
    // 判断文件是否存在
    if (!imageList.value.includes(file)) {
      imageList.value.push(file)
    }
    // 上传文件 成功后根据 uid 更改 fileList 状态 为success
    const formData = new FormData()
    formData.append('file', file.raw as Blob)
    formData.append('bgShare', porps.type)
    formData.append('bgType', '0')

    const config = {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        console.log('onUpdatedProgress', progressEvent)
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    }
    file.status = 'uploading'
    // const interval = setInterval(() => {
    //   if (uploadProgress.value < 100) {
    //     uploadProgress.value += 10;
    //   } else {
    //     clearInterval(interval);
    //     const findFile = fileList.value.find(item => item.uid === file.uid)
    //     if (findFile) {
    //       findFile.status = 'fail'
    //     }
    //   }
    // }, 1000);
    try {
      const res = await uploadBackground(formData, config)
      console.log(res)
      if (res.code === 0) {
        const findFile = imageList.value.find((item) => item.uid === file.uid)
        if (findFile) {
          findFile.status = 'success'
          findFile.uid = res.data.id
          findFile.url = res.data.url
          findFile.showDelete = false
        }
      } else {
        const findFile = imageList.value.find((item) => item.uid === file.uid)
        if (findFile) {
          findFile.status = 'fail'
        }
      }
    } catch (error) {
      const findFile = imageList.value.find((item) => item.uid === file.uid)
      if (findFile) {
        findFile.status = 'fail'
      }
    }
  } else if (isVideo && activeTab.value === 'video' && file.status === 'ready') {
    uploadProgress.value = 0
    file.url = URL.createObjectURL(file.raw as Blob)
    if (!videoList.value.includes(file)) {
      videoList.value.push(file)
    }
    // 上传文件 成功后根据 uid 更改 fileList 状态 为success
    const formData = new FormData()
    formData.append('file', file.raw as Blob)
    formData.append('bgShare', porps.type)
    formData.append('bgType', '1')
    const config = {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    }
    file.status = 'uploading'
    try {
      const res = await uploadBackground(formData, config)
      console.log(res)
      if (res.code === 0) {
        const findFile = videoList.value.find((item) => item.uid === file.uid)
        if (findFile) {
          findFile.status = 'success'
          findFile.uid = res.data.id
          findFile.url = res.data.url
          findFile.showDelete = false
        }
      } else {
        const findFile = videoList.value.find((item) => item.uid === file.uid)
        if (findFile) {
          findFile.status = 'fail'
        }
      }
    } catch (error) {
      const findFile = videoList.value.find((item) => item.uid === file.uid)
      if (findFile) {
        findFile.status = 'fail'
      }
    }
  } else {
    ElMessage.error('请上传正确的文件类型')
    return false
  }
}

const fileToUrl = (file: bgItem) => {
  console.log(file)
  return URL.createObjectURL(file.raw as Blob)
}

const getBackgroundListPage = async () => {
  const params = {
    pageNum: 1,
    pageSize: 50,
    bgName: '',
    bgShare: porps.type,
    bgType: activeTab.value === 'image' ? '0' : '1'
  }
  const res = await getBackgroundList(params)
  console.log(res)
  const list = res.data.map((item) => ({
    name: item.bgName,
    url: item.bgUrl,
    uid: item.id,
    showDelete: false,
    status: 'success'
  }))
  if (activeTab.value === 'image') {
    imageList.value = list
  } else {
    videoList.value = list
  }
}

// 计算每段的宽度

const segmentTopWidth = computed(() => {
  if (uploadProgress.value <= 25) {
    // 计算宽度 25/ 100 为  100%
    return (uploadProgress.value / 25) * 100 + '%'
  } else if (uploadProgress.value > 25) {
    return '100%'
  }
  return '0%'
})
const segmentRightWidth = computed(() => {
  if (uploadProgress.value > 25 && uploadProgress.value <= 50) {
    return ((uploadProgress.value - 25) / 25) * 100 + '%'
  } else if (uploadProgress.value > 50) {
    return '100%'
  }
  return '0%'
})

const segmentBottomWidth = computed(() => {
  if (uploadProgress.value > 50 && uploadProgress.value <= 75) {
    return ((uploadProgress.value - 50) / 25) * 100 + '%'
  } else if (uploadProgress.value > 75) {
    return '100%'
  }
  return '0%'
})
const segmentLeftWidth = computed(() => {
  if (uploadProgress.value > 75 && uploadProgress.value <= 100) {
    return ((uploadProgress.value - 75) / 25) * 100 + '%'
  }
  return '0%'
})
const onRetry = (e: MouseEvent, item: bgItem) => {
  e.stopPropagation()
  console.log('onRetry', item)
  item.status = 'ready'
  onChange(item)
}

const onDelete = async (e, item) => {
  e.stopPropagation()
  const res = await deleteBackground({ id: item.uid })
  console.log(res)
  if (res.data === 0) {
    ElMessage.success('删除成功')
    getBackgroundListPage()
  } else {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  getBackgroundListPage()
})
</script>

<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="图片" name="image" />
      <el-tab-pane label="视频" name="video" />
    </el-tabs>
    <div class="flex flex-wrap gap-25px mt-20px w-full content-start">
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        :on-change="onChange"
        :accept="activeTab === 'image' ? 'image/*' : 'video/*'"
        class="w-85px h-85px"
      >
        <div
          class="w-85px h-85px p-2px border-1px border border-solid rounded-1 flex justify-center items-center color-gray"
        >
          <Icon icon="system-uicons:plus" :size="35" />
        </div>
      </el-upload>

      <div
        v-for="item in currentList"
        :key="item.uid"
        class="w-85px h-85px border border-solid rounded-1 p-2px flex justify-center items-center color-gray overflow-hidden relative"
        :class="{ 'border-#409eff': selectId === item.uid + '' }"
        @click="onItemClick(item)"
      >
        <el-image v-if="activeTab === 'image'" :src="item.url" class="w-85px h-85px">
          <template #placeholder></template>
        </el-image>
        <video v-else :src="item.url" class="w-85px h-85px" disablePictureInPicture></video>

        <div
          v-if="item.status === 'uploading'"
          class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"
        >
          <div
            class="absolute top-0 left-0 h-4px bg-blue-500 transition-all duration-500"
            :style="{ width: segmentTopWidth }"
          ></div>
          <div
            class="absolute top-0 right-0 w-4px bg-blue-500 transition-all duration-500"
            :style="{ height: segmentRightWidth }"
          ></div>
          <div
            class="absolute bottom-0 right-0 h-4px bg-blue-500 transition-all duration-500"
            :style="{ width: segmentBottomWidth }"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-4px bg-blue-500 transition-all duration-500"
            :style="{ height: segmentLeftWidth }"
          ></div>
          <span
            class="absolute top-0 left-0 w-full h-full flex justify-center items-center color-white text-12px"
            >{{ uploadProgress }}%</span
          >
        </div>
        <div
          v-if="item.status === 'fail'"
          class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center"
        >
          <div
            class="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center"
          >
            <span class="color-white text-12px">上传失败</span>
            <el-button type="primary" size="small" @click.stop="onRetry($event, item)"
              >重试</el-button
            >
          </div>
        </div>
        <div
          v-if="item.status === 'success'"
          class="absolute top-0 left-0 w-full h-full flex justify-end"
          @mouseenter="item.showDelete = true"
          @mouseleave="item.showDelete = false"
        >
          <Icon
            v-if="item.showDelete"
            class="color-blue-500"
            icon="material-symbols-light:cancel-outline"
            :size="24"
            @click.stop="onDelete($event, item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
