<!--
 * 删除元素按钮
-->

<template>
  <el-tooltip v-if="mixinState.mSelectMode" :content="$t('editor.quick.del')">
    <el-button @click="del" text>
      <Icon icon="system-uicons:trash" :size="16" />
    </el-button>
  </el-tooltip>
</template>

<script setup name="Del">
import useSelect from '@/hooks/select'
import { debounce } from 'lodash-es'

const { mixinState, canvasEditor } = useSelect()

const del = debounce(function () {
  canvasEditor.del()
}, 300)
</script>
