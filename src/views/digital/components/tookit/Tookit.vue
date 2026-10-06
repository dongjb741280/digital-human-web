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
  <div class="flex items-center mt-20px mb-16px">
    <div class="dh-section-title">AI创意工具</div>
    <el-tabs
      v-model="tabsVModel"
      class="ml-20px h-28px"
      style="--el-tabs-header-height: 28px; --el-border-color-light: transparent"
    >
      <el-tab-pane label="视频工具" name="video" />
      <el-tab-pane label="音频工具" name="voice" />
    </el-tabs>
  </div>

  <div class="flex flex-wrap gap-4">
    <template v-for="(tool, index) in tools[tabsVModel]" :key="index">
      <div class="dh-tool-card" @click="onClick(tool)">
        <div class="tool-icon">
          <img :src="svgUrl(tool.icon)" class="tool-icon-img" />
        </div>
        <div class="tool-name">{{ tool.name }}</div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.dh-tool-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 250px;
  height: 56px;
  padding: 0 16px;
  background: var(--dh-surface, #fff);
  border: 1px solid var(--el-border-color-lighter, #eef0f5);
  border-radius: var(--dh-radius-sm, 10px);
  box-shadow: var(--dh-shadow-sm);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.dh-tool-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--dh-shadow-md);
  border-color: var(--dh-primary, #3d6bff);
}

.tool-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--dh-gradient-soft);
}

.tool-icon-img {
  width: 22px;
  height: 22px;
}

.tool-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--dh-text, #12224a);
}
</style>
