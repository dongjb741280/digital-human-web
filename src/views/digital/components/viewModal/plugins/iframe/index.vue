<!-- 外链 -->
<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const loading = ref(true)
const iframeRef = ref()
onMounted(() => {
  iframeRef.value.onload = function () {
    loading.value = false
    console.log('iframe加载完成')
  }
  iframeRef.value.onerror = function () {
    console.log('iframe加载失败')
  }
})
</script>

<template>
  <div class="w-full h-full" v-loading="loading">
    <iframe
      ref="iframeRef"
      :src="data.src"
      class="w-full h-full"
      frameborder="0"
      scrolling="auto"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</template>
