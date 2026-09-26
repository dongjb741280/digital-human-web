<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="直播信息" name="first">
        <AiLiveMainDetailBase :aiLiveMainVO="aiLiveMainVO"/>
    </el-tab-pane>
    <el-tab-pane label="直播详情" name="second">
        <div class="flex flex-wrap gap-5 w-full mt-2">
            <AiLiveMainDetailVideo type="0" cardType="1" :videoId="videoId"/>
        </div>
    </el-tab-pane>
    <el-tab-pane label="观看记录" name="third">
        <AiLiveWatchHistory :liveId="id"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import AiLiveMainDetailVideo from "@/views/digital/live/AiLiveMainDetailVideo.vue"
import AiLiveMainDetailBase from '@/views/digital/live/AiLiveMainDetailBase.vue'
import AiLiveWatchHistory from '@/views/digital/live/AiLiveMainDetailWatchHistory.vue'


const props = defineProps(['aiLiveMainVO', 'id', 'videoId'])

const { aiLiveMainVO, id, videoId } = toRefs(props);

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  console.log(aiLiveMainVO, id)
}
</script>

<style>
</style>
