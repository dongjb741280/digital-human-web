<!--
 * 插入SVG元素
-->

<template>
  <div class="inline-block">
    <el-dropdown transfer-class-name="fix" @command="insertTypeHand">
      <el-button size="small" text>
        {{ $t('editor.insertFile.insert') }}
        <Icon icon="ep:arrow-down" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 图片 -->
          <el-dropdown-item command="insertImg">{{
            $t('editor.insertFile.insert_picture')
          }}</el-dropdown-item>
          <!-- SVG -->
          <el-dropdown-item command="insertSvg">{{
            $t('editor.insertFile.insert_SVG')
          }}</el-dropdown-item>
          <!-- SVG 字符串 -->
          <el-dropdown-item command="insertSvgStrModal">{{
            $t('editor.insertFile.insert_SVGStr')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 插入字符串svg元素 -->
    <el-dialog
      v-model="state.showModal"
      :title="$t('editor.insertFile.modal_tittle')"
      width="500px"
    >
      <el-input
        v-model="state.svgStr"
        show-word-limit
        type="textarea"
        :placeholder="$t('editor.insertFile.insert_SVGStr_placeholder')"
      />

      <template #footer>
        <div class="">
          <el-button @click="state.showModal = false">Cancel</el-button>
          <el-button type="primary" @click="insertTypeHand('insertSvgStr')"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ImportFile'
})
import { Utils } from '@editor/core'
const { getImgStr, selectFiles } = Utils

import useSelect from '@/hooks/select'
import { v4 as uuid } from 'uuid'

const { fabric, canvasEditor } = useSelect()
const state = reactive({
  showModal: false,
  svgStr: ''
})
const HANDLEMAP = {
  // 插入图片
  insertImg: function () {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertImgFile(file)
        })
      })
    })
  },
  // 插入Svg
  insertSvg: function () {
    selectFiles({ accept: '.svg', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertSvgFile(file)
        })
      })
    })
  },
  // 插入SVG元素
  insertSvgStrModal: function () {
    state.svgStr = ''
    state.showModal = true
  },
  // 插入字符串元素
  insertSvgStr: function () {
    fabric.loadSVGFromString(state.svgStr, (objects, options) => {
      const item = fabric.util.groupSVGElements(objects, {
        ...options,
        name: 'defaultSVG',
        id: uuid()
      })
      canvasEditor.canvas.add(item).centerObject(item).renderAll()
    })
  }
}

const insertTypeHand = (type) => {
  const cb = HANDLEMAP[type]
  cb && typeof cb === 'function' && cb()
}
// 插入图片文件
function insertImgFile(file) {
  if (!file) throw new Error('file is undefined')
  const imgEl = document.createElement('img')
  imgEl.src = file
  // 插入页面
  document.body.appendChild(imgEl)
  imgEl.onload = () => {
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: '图片1',
      left: 100,
      top: 100
    })
    // 设置缩放
    canvasEditor.canvas.add(imgInstance)
    canvasEditor.canvas.setActiveObject(imgInstance)
    canvasEditor.canvas.renderAll()
    // 删除页面中的图片元素
    imgEl.remove()
  }
}

// 插入文件元素
function insertSvgFile(svgFile) {
  if (!svgFile) throw new Error('file is undefined')
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid()
    })
    canvasEditor.canvas.add(item).centerObject(item).renderAll()
  })
}
</script>
