<!--我的资源-->
<script lang="ts" setup>
import { ref } from "vue";
import { CardContainer,VoiceContainer, TextContainer } from "../";
defineOptions({
  name: 'DResources'
})
const router = useRouter()
const tabsVModel = ref('1')
const onMore = () => {
  if (tabsVModel.value === '1') {
    // 数字人形象
    router.push({ path: '/digital/digitalPersonManage' })
  } else if (tabsVModel.value === '2') {
    // 数字人声音
    router.push({ path: '/digital/voiceManagement' })
  } else {
    // 数字人文案
    router.push({ path: '/digital/text-mgmt' })
  }
  console.log('更多')
}
</script>

<template>
  <div class="flex justify-between mt-10px">
    <div class="flex lg:items-center lg:flex-row md:flex-col md:items-start">
      <div
        class="h-21px relative layout-border__left color-#666666 fw-600 !before:w-1 !before:bg-#409eff m-10px pl-2 mt-20px mb-20px w-fit">
        我的资源
      </div>
      <el-tabs
        v-model="tabsVModel"
        class="ml-20px h-28px"
        style="--el-tabs-header-height:28px; --el-border-color-light: transparent ">
        <el-tab-pane label="数字人形象" name="1" />
        <el-tab-pane label="数字人声音" name="2" />
        <el-tab-pane label="数字人文案" name="3" />
      </el-tabs>
    </div>
    <span class="ml-2 text-size-12px text-gray cursor-pointer hover:text-blue" @click="onMore">更多>></span>
  </div>
  <CardContainer v-show="tabsVModel==='1'" />
  <VoiceContainer v-show="tabsVModel==='2'" />
  <TextContainer v-show="tabsVModel==='3'" />
</template>