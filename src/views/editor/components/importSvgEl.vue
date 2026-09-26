<template>
  <div>
    <div class="pt-10px flex">
      <el-button @click="handleUpload">
        <Icon icon="system-uicons:plus" :size="20" />
      </el-button>

      <el-input
        class="ml-10px"
        v-model="state.search"
        :placeholder="state.placeholder"
        :suffix-icon="Search"
        @change="search"
      />
    </div>

    <div :key="item.value" v-for="item in state.materialist" v-loading="loading">
      <el-divider content-position="left">{{ item.label }}</el-divider>
      <el-tooltip
        :content="info.label"
        v-for="(info, i) in item.list"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <el-image
          class="inline-block w-53px ml-2px mb-2px bg-#f5f5f5 p-6px cursor-pointer"
          :alt="info.label"
          :src="info.src"
          @click="addItem"
          @dragend="dragItem"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup name="ImportSvg" lang="ts">
import { Search } from '@element-plus/icons-vue'
import useSelect from '@/hooks/select'
import { cloneDeep, values } from 'lodash-es'
import { fabric } from 'fabric'
import { v4 as uuid } from 'uuid'
import { Utils } from '@editor/core'
const { getImgStr, selectFiles } = Utils
import { uploadMaterial, getMaterialList, deleteMaterial } from '@/api/digital'
const loading = ref(false)

const { canvasEditor }: { canvasEditor: any } = useSelect()

const defaultPosition = {
  left: 100,
  top: 100,
  shadow: '',
  fontFamily: '1-1'
}

interface materialTypeI {
  value: string
  label: string
  list?: materialItemI[]
}

interface materialItemI {
  value: string
  label: string
  src: string
}

const state = reactive<{
  search: string
  placeholder: string
  jsonFile: any
  materialType: string[]
  materialTypelist: materialTypeI[]
  materialist: materialTypeI[]
}>({
  search: '',
  placeholder: '',
  jsonFile: null,
  materialType: [''], // 选中分类
  materialTypelist: [], // 分类列表
  materialist: [] // 列表内容
})

// 获取素材分类
// canvasEditor.getMaterialType('svg').then((list: materialTypeI[]) => {
//   state.materialTypelist = [...list]
//   state.materialist = list
// })
onMounted(() => {
  // 获取素材分类
  getMaterialList({
    pageNum: 1,
    pageSize: 50,
    materialName: '',
    bgShare: '0',
    materialType: '1'
  }).then((resp) => {
    console.log(resp)
    const list = resp.data.map((item) => ({
      label: item.materialName,
      src: item.materialUrl,
      value: item.id
    }))
    state.materialTypelist = [{ label: '全部', value: '', list }]
    state.materialist = [{ label: '全部', value: '', list }]
  })
})

const handleUpload = () => {
  selectFiles({ accept: 'image/*', multiple: false }).then((fileList: FileList) => {
    Array.from(fileList).forEach((item) => {
      const formData = new FormData()
      formData.append('file', item as Blob)
      formData.append('bgShare', '0')
      formData.append('type', '1')
      const config = {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log('onUpdatedProgress', progress)
        }
      }
      uploadMaterial(formData, config).then((res) => {
        const url = res.data.url
        if (state.materialist.length > 0) {
          const list = state.materialist[0].list
          list.push({
            label: item.name,
            src: url,
            value: res.data.id
          })
        } else {
          state.materialist = [
            {
              label: '全部',
              value: '',
              list: [
                {
                  label: item.name,
                  src: url,
                  value: res.data.id
                }
              ]
            }
          ]
        }
      })
    })
  })
}

// 切换素材类型
const handleChange = (e: Event, item: [materialTypeI]) => {
  // 搜索框文字设置
  const { label, value } = item[0]
  state.placeholder = label
  state.search = ''
  filterTypeList(value)
}

// 模板搜索功能
const filterTypeList = (value: string) => {
  // 全部类型
  if (!value) {
    state.materialist = cloneDeep(state.materialTypelist)
  } else {
    // 当前分类详情
    const materialTypeInfoList = state.materialTypelist.filter((item) => item.value === value) || []
    state.materialist = materialTypeInfoList
  }

  // 展示分类
  if (state.search) {
    const list = cloneDeep(state.materialist)
    // 按照搜索内容展示
    state.materialist = list.map((item) => {
      if (item.list) {
        item.list = item.list.filter((info) => info.label.includes(state.search))
      }
      return item
    })
  }
}

const search = () => {
  const [typeValue] = state.materialType
  filterTypeList(typeValue)
}

const dragItem = (event: Event) => {
  const target = event.target as HTMLImageElement
  const url = target.src
  const imgEl = document.createElement('img')
  imgEl.src = url
  imgEl.crossOrigin = 'anonymous'
  // 插入页面
  document.body.appendChild(imgEl)
  imgEl.onload = () => {
    const width = canvasEditor.canvas.width
    // 计算缩放比
    const imgScale = width / imgEl.width
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: '图片1',
      left: 100,
      top: 100,
      scaleX: imgScale,
      scaleY: imgScale
    })
    canvasEditor.dragAddItem(imgInstance, event)
    // 删除页面中的图片元素
    imgEl.remove()
  }
}

// 按照类型渲染
const addItem = (e: Event) => {
  const target = e.target as HTMLImageElement
  const url = target.src
  const imgEl = document.createElement('img')
  imgEl.src = url
  imgEl.crossOrigin = 'anonymous'
  // 插入页面
  document.body.appendChild(imgEl)
  imgEl.onload = () => {
    const width = canvasEditor.canvas.width
    // 计算缩放比
    const imgScale = width / imgEl.width
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: '图片1',
      left: 100,
      top: 100,
      scaleX: imgScale,
      scaleY: imgScale
    })
    // 设置缩放
    canvasEditor.canvas.add(imgInstance)
    canvasEditor.canvas.setActiveObject(imgInstance)
    canvasEditor.canvas.renderAll()
    // 删除页面中的图片元素
    imgEl.remove()
  }
}
</script>
