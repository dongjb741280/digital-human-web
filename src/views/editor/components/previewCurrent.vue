<!--
 * 预览组件
-->
<template>
  <div class="inline-block">
    <el-button text @click="preview">
      {{ $t('editor.preview') }}
    </el-button>
    <el-dialog
      :title="$t('editor.preview')"
      v-model="dialogVisible"
      width="60%"
      top="10vh"
      :before-close="beforeClose"
    >
      <el-image :src="imageUrl" fit="contain" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
const canvasEditor: any = inject('canvasEditor')
const imageUrl = ref('')
const dialogVisible = ref(false)
const preview = () => {
  canvasEditor.preview().then((dataUrl: string) => {
    // const dataUrl = getImgUrl();
    dialogVisible.value = true
    imageUrl.value = dataUrl
  })
}
const beforeClose = () => {
  dialogVisible.value = false
  imageUrl.value = ''
}
</script>
