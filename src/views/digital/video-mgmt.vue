<!--视频管理-->
<script lang="ts" setup>
import { DigitalVideo } from './components'
const router = useRouter()
defineOptions({
  name: 'VideoMgmt'
})
const tabsVModel = ref('0')
const radioValue = ref('0') // 草稿/成品/我的视频/公共
const onClick = () => {
  router.push({ path: '/digital/video-prod'})
}
</script>
<template>
  <div>
    <div class="flex items-center flex-row justify-between">
      <el-tabs
      v-model="tabsVModel" class="ml-20px h-28px"
      style="--el-tabs-header-height:28px; --el-border-color-light: transparent ">
      <el-tab-pane label="数字人视频" name="0" />
      <el-tab-pane label="数字人卡片" name="1" />
    </el-tabs>
    <el-button size="small" type="primary" @click="onClick">立即制作</el-button>
    </div>

    <div class="mt-20px" v-cloak>
      <div v-show="tabsVModel === '0'" >
        <el-radio-group v-model="radioValue">
          <el-radio value="0" border>我的视频</el-radio>
          <el-radio value="1" border>公共库</el-radio>
        </el-radio-group>
      </div>
      <div v-show="tabsVModel === '1'" >
        <el-radio-group v-model="radioValue">
          <el-radio value="0" border>我的卡片</el-radio>
          <el-radio value="1" border>公共库</el-radio>
          <el-radio value="2" border>收藏</el-radio>
        </el-radio-group>
      </div>
      <DigitalVideo class="mt-20px" :type="radioValue" :cardType="tabsVModel" :key="tabsVModel" pagination/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-radio__inner){
    display: none;
}
[v-cloak]{
  display: none !important;
  }
</style>
