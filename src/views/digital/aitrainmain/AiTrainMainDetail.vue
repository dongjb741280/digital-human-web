<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="课程信息" name="first">
        <AiTrainMainDetailBase :aiTrainMainVO="aiTrainMainVO"/>
    </el-tab-pane>
    <el-tab-pane label="课程详情" name="second">
        <div class="flex flex-wrap gap-5 w-full mt-2">
            <AiTrainMainDetailVideo type="0" cardType="1" :videoId="videoId" :createType="createType" :videoUrl="videoUrl"/>
        </div>
    </el-tab-pane>
    <el-tab-pane label="观看记录" name="third">
        <AiTrainWatchHistory :trainId="id"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import AiTrainMainDetailVideo from "@/views/digital/aitrainmain/AiTrainMainDetailVideo.vue"
import AiTrainMainDetailBase from '@/views/digital/aitrainmain/AiTrainMainDetailBase.vue'
import AiTrainWatchHistory from '@/views/digital/aitrainmain/AiTrainMainDetailWatchHistory.vue'

const props = defineProps(['aiTrainMainVO', 'id', 'videoId', 'createType', 'videoUrl'])

const { aiTrainMainVO, id, videoId , createType, videoUrl} = toRefs(props);

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  console.log(aiTrainMainVO, id)
}
</script>

<style>
</style>
