<!--
 * 回退重做
-->

<template>
  <div class="inline-block">
    <!-- 后退 -->
    <el-tooltip :content="$t('editor.history.revocation') + `(${canUndo})`">
      <el-button @click="undo" text size="small" :disabled="!canUndo">
        <Icon icon="system-uicons:backward" :size="20" />
      </el-button>
    </el-tooltip>

    <!-- 重做 -->
    <el-tooltip :content="$t('editor.history.redo') + `(${canRedo})`">
      <el-button @click="redo" text size="small" :disabled="!canRedo">
        <Icon icon="system-uicons:forward" :size="20" />
      </el-button>
    </el-tooltip>
    <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
  </div>
</template>

<script setup lang="ts">
import useSelect from '@/hooks/select'
const { canvasEditor } = useSelect() as { canvasEditor: any }
defineOptions({
  name: 'History'
})
const canUndo = ref(0)
const canRedo = ref(0)
// 后退
const undo = () => {
  canvasEditor.undo()
}
// 重做
const redo = () => {
  canvasEditor.redo()
}

onMounted(() => {
  canvasEditor.on('historyUpdate', (canUndoParam: number, canRedoParam: number) => {
    canUndo.value = canUndoParam
    canRedo.value = canRedoParam
  })
})
</script>
