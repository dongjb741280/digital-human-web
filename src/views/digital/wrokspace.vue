<!-- 数字人创作空间-->
<script lang="ts" setup>
import { DNavbar, ArtWork, Tookit, DResources } from './components'
</script>

<template>
  <div class="w-full h-full dh-workspace">
    <div class="dh-workspace-inner">
      <DNavbar />
      <Tookit />
      <ArtWork />
      <DResources />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dh-workspace {
  background: var(--dh-bg, #f5f7ff);
}

.dh-workspace-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 20px 40px;
}
</style>
