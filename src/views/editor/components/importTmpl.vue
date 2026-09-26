<!--
 * 导入模板
-->

<template>
  <div>
    <div class="pt-10px flex">
      <!-- <el-button>
        <Icon icon="system-uicons:drag" :size="20" />
      </el-button> -->

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
          class="w-132px cursor-pointer mr-5px"
          :alt="info.label"
          src="http://10.19.28.109:9001/aidigital/materia/1737015757185design_20250116161851.png"
          @click="beforeClearTip(info)"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup name="ImportTmpl" lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import useSelect from '@/hooks/select'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'

const { t } = useI18n()
const { canvasEditor }: { canvasEditor: any } = useSelect()

interface materialTypeI {
  value: string
  label: string
  list?: materialItemI[]
}

interface materialItemI {
  value: string
  label: string
  tempUrl: string
  src: string
}

const allType: materialTypeI = {
  value: '',
  label: '全部',
}
const loading = ref(false)

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
//获取素材分类
canvasEditor.getMaterialType('template').then((list: materialItemI[]) => {

  state.materialTypelist = []
  state.materialist = [{ label: '全部', value: '', list }] || []
  console.log('request template',state.materialist)
})


// 插入文件
const insertSvgFile = () => {
  canvasEditor.insertSvgFile(state.jsonFile)
}

// 替换提示
const beforeClearTip = (item: materialItemI) => {
  console.log('beforeClearTip', '--------')
  ElMessageBox.confirm(`${t('editor.replaceTip')}`).then(() => {
    canvasEditor.saveTempData(item)
    getTempData(item.tempUrl)
  })
}

// 获取模板数据
const getTempData = (tmplUrl: string) => {
  state.jsonFile = tmplUrl
  insertSvgFile()
}
// 切换素材类型
const handleChange = (item: materialItemI) => {
  // 搜索框文字设置
  const { label, value } = item
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
</script>
