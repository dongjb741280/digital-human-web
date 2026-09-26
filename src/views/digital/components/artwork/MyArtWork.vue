<!--我的作品-->
<script lang="ts" setup>
import { ref } from 'vue'
import { DigitalVideo } from "../video";
const router = useRouter()
defineOptions({
  name: 'ArtWork'
})
const tabsVModel = ref('0')
const radioValue = ref('1')

const onMore = () => {
  if (tabsVModel.value === '1') {
    // 数字人视频
  } else {
    // 数字人卡片
  }
  router.push({ path: '/digital/video-mgmt' })
  console.log('更多')
}


</script>

<template>
  <div class="flex justify-between mt-10px">
    <div class="flex items-center flex-row">
      <div
        class="h-21px relative layout-border__left color-#666666 fw-600 !before:w-1 !before:bg-#409eff m-10px pl-2 mt-20px mb-20px w-fit">
        我的作品</div>
      <el-tabs
        v-model="tabsVModel"
        class="ml-20px h-28px"
        style="--el-tabs-header-height:28px; --el-border-color-light: transparent ">
        <el-tab-pane label="数字人视频" name="0" />
        <el-tab-pane label="数字人卡片" name="1" />
      </el-tabs>
    </div>
    <div class="flex items-center">
      <el-radio-group size="small" v-model="radioValue">
        <el-radio-button label="草稿" value="0" />
        <el-radio-button label="成品" value="1" />
      </el-radio-group>
      <span class="ml-2 text-size-12px text-gray cursor-pointer hover:text-blue" @click="onMore">更多>></span>
    </div>
  </div>
  <!-- <DigitalVideo v-show="tabsVModel === '0'"  :video-save="radioValue"  :cardType="tabsVModel" :key="tabsVModel"/>
  <DigitalVideo v-show="tabsVModel === '1'" :video-save="radioValue"  :cardType="tabsVModel" :key="tabsVModel"/> -->
  <keep-alive>
    <component 
      :is="DigitalVideo" 
      :video-save="radioValue" 
      :cardType="tabsVModel" 
      :key="tabsVModel"
    />
  </keep-alive>
</template>
