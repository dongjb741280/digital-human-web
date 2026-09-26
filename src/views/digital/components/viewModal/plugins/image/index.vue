<!-- 图片-->
<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <el-image :src="data.src" :preview-src-list="[data.src]" />
  </div>
</template>
