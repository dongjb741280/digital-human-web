<!--
 * 字体文件
-->

<template>
  <div class="inline-block">
    <el-divider plain content-position="left">{{ $t('editor.title_template') }}</el-divider>
    <el-tooltip
      :content="item.label"
      v-for="(item, i) in list"
      :key="`${i}-bai1-button`"
      placement="top"
    >
      <el-image
        class="w-86px cursor-pointer mr-5px"
        :alt="item.label"
        :src="getFontUrl(item.src)"
        @click="getTempData(i)"
      />
    </el-tooltip>
  </div>
</template>

<script setup>
import useSelect from '@/hooks/select'
import { v4 as uuid } from 'uuid'
import { useI18n } from 'vue-i18n'
import { fontArray } from './fontData'
import { fontUrl } from '@/utils/imgURL'
defineOptions({
  name: 'FontTmpl'
})
const { fabric, canvasEditor } = useSelect()
const { t } = useI18n()
const list = [
  {
    label: '字体',
    src: '1'
  },
  {
    label: '字体',
    src: '2'
  },
  {
    label: '字体',
    src: '3'
  },
  {
    label: '字体',
    src: '4'
  },
  {
    label: '字体',
    src: '5'
  }
]
const getFontUrl = (src) => {
  const tempUrl = fontUrl(src)
  return tempUrl
}
// 插入文件
const insertFile = (obj) => {
  obj.id = uuid()
  new fabric.Textbox.fromObject(obj, (e) => {
    canvasEditor.canvas.add(e)
    e.center()
    canvasEditor.canvas.setActiveObject(e)
  })
}
// 获取模板数据
const getTempData = (tmplUrl) => {
  if (!fontArray[tmplUrl]) return
  insertFile(fontArray[tmplUrl])
}
</script>
