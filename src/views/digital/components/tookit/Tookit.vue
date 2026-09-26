<!--工具集-->
<script lang="ts" setup>
import { svgUrl } from '@/utils/imgURL'
// 视频工具：人像抠图、视频转换、视频合并、视频倒播、视频调速、视频缩放
// 音频工具：音频提取、音频转换、音频合并、音频降噪、音频调速、音量调整
const tools = ref({
  video: [
    {
      name: '人像抠图',
      icon: 'digital-tookit'
    },
    {
      name: '视频转换',
      icon: 'digital-tookit'
    },
    {
      name: '视频合并',
      icon: 'digital-tookit'
    },
    {
      name: '视频倒播',
      icon: 'digital-tookit'
    },
    {
      name: '视频调速',
      icon: 'digital-tookit'
    },
    {
      name: '视频缩放',
      icon: 'digital-tookit'
    }
  ],
  voice: [
    {
      name: '音频提取',
      icon: 'digital-tookit'
    },
    {
      name: '音频转换',
      icon: 'digital-tookit'
    },
    {
      name: '音频合并',
      icon: 'digital-tookit'
    },
    {
      name: '音频降噪',
      icon: 'digital-tookit'
    },
    {
      name: '音频调速',
      icon: 'digital-tookit'
    },
    {
      name: '音量调整',
      icon: 'digital-tookit'
    }
  ]
})
const onClick = (tool: any) => {
  console.log('点击', tool)
}
const tabsVModel = ref('video')
</script>

<template>
  <div
    class="relative layout-border__left color-#666666 fw-600 !before:w-1 !before:bg-#409eff m-10px pl-2 mt-20px mb-20px flex flex-row items-center"
  >
    AI创意工具
    <el-tabs
      v-model="tabsVModel"
      class="ml-20px h-28px"
      style="--el-tabs-header-height: 28px; --el-border-color-light: transparent"
    >
      <el-tab-pane label="视频工具" name="video" />
      <el-tab-pane label="音频工具" name="voice" />
    </el-tabs>
  </div>

  <div class="flex flex-wrap gap-5">
    <template v-for="(tool, index) in tools[tabsVModel]" :key="index">
      <div
        class="flex items-center w-250px h-50px bg-#F3FAFD border border-solid border-gray-100 rounded-2 pl-2 shadow-sm hover:border-#409eff"
        @click="onClick(tool)"
      >
        <img :src="svgUrl(tool.icon)" class="w-40px h-40px" />
        <div class="w-full text-center font-600 text-16px text-#333333">{{ tool.name }}</div>
      </div>
    </template>
  </div>
</template>
