<!--
 * 拖拽模式
-->

<template>
  <div class="box">
    <el-switch
      v-model="status"
      size="large"
      inline-prompt
      active-text="拖拽"
      inactive-text="选择"
      @change="switchMode"
    />
  </div>
</template>

<script setup name="Drag">
import useSelect from '@/hooks/select'
const status = ref(false)
const { canvasEditor } = useSelect()

const switchMode = (val) => {
  if (val) {
    canvasEditor.startDring()
  } else {
    canvasEditor.endDring()
  }
}
// const handleKeyDown = (e) => {
//   if (status.value) return;
//   if (e.code === 'Space') {
//     status.value = true;
//     canvas.editor.editorWorkspace.startDring();
//   }
// };
// const handleKeyUp = (e) => {
//   if (e.code === 'Space') {
//     status.value = false;
//     canvas.editor.editorWorkspace.endDring();
//   }
// };

onMounted(() => {
  canvasEditor.on('startDring', () => (status.value = true))
  canvasEditor.on('endDring', () => (status.value = false))
})

onBeforeUnmount(() => {
  canvasEditor.off('startDring')
  canvasEditor.off('endDring')
})
</script>
<style scoped lang="scss">
.box {
  position: absolute;
  right: 193px;
  bottom: 5px;
}
</style>
