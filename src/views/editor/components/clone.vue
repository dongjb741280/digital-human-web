<template>
  <el-tooltip v-if="mixinState.mSelectMode === 'one'" :content="$t('editor.quick.copy')">
    <el-button @click="clone" text>
      <Icon icon="system-uicons:clipboard-copy" :size="16" />
    </el-button>
  </el-tooltip>
</template>

<script setup name="Clone">
import useSelect from '@/hooks/select'
import { debounce } from 'lodash-es'

const { mixinState, canvasEditor } = useSelect()
const clone = debounce(function () {
  canvasEditor.clone()
}, 300)
</script>
