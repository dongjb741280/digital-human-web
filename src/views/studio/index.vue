<template>
  <div class="workspace-container">
    <!-- 左侧视频播放区域 -->
    <div class="player-panel" :class="{ 'full-width': routeLessonId }">
      <StudioPlayer 
        :video-info="selectedVideo" 
        :lesson-id="routeLessonId"
        v-if="selectedVideo || routeLessonId" 
        @updatePlayingId="handleUpdatePlayingId"
      />
      <div class="empty-player" v-else>
        <div class="empty-content">
          <el-icon class="empty-icon"><VideoPlay /></el-icon>
          <h3>暂无播放内容</h3>
          <p>请从右侧列表选择要播放的视频</p>
        </div>
      </div>
    </div>
    
    <!-- 右侧列表区域 -->
    <div class="list-panel" v-if="!routeLessonId">
      <NavTab ref="navTabRef" @update:activeTab="handleTabChange"></NavTab>
      <ChatH5></ChatH5>
      <ElScrollbar>
        <StudioNotice 
          v-if="pageTitle === '直播'" 
          @videoSelect="handleVideoSelect" 
          :current-playing-id="currentPlayingId"
        />
        <StudioLesson 
          v-if="pageTitle === '课程'" 
          @videoSelect="handleVideoSelect" 
          :current-playing-id="currentPlayingId"
        />
      </ElScrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup name="studio">
import StudioNotice from './studio-notice.vue'
import StudioPlayer from './studio-player.vue'
import StudioLesson from './studio-lesson.vue'
import { ref, watch, shallowRef } from 'vue'
import { ElScrollbar } from 'element-plus'
import { NavTab } from "./components/tab";
import { VideoPlay } from '@element-plus/icons-vue'
import { ChatH5 } from "@/layout/components/chat-h5";
import { useRoute } from 'vue-router'

const route = useRoute()
const routeLessonId = ref(route.query.lessonId as string || '')

/** 数字人课程管理 列表 */
defineOptions({ name: 'studio' })

// 当前选中的视频信息
const selectedVideo = ref(null)
const navTabRef = ref(null)
const pageTitle = ref('直播')
// 添加当前播放视频的ID
const currentPlayingId = ref('')

const handleVideoSelect = (videoInfo) => {
  // 先停止当前播放
  currentPlayingId.value = ''
  // 再设置新视频
  selectedVideo.value = videoInfo
}

const handleUpdatePlayingId = (id) => {
  currentPlayingId.value = id
}
// 处理标签页切换
const handleTabChange = (tabName) => {
  pageTitle.value = tabName
}

// 监听子组件的标题变化
watch(
  () => navTabRef.value?.title,
  (newValue, oldValue) => {
    pageTitle.value = newValue ? newValue : oldValue
  }
)
</script>

<style lang="scss" scoped>
.workspace-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: #F6F8FA;
  
  .player-panel {
    flex: 1;
    height: 100%;
    border-right: 1px solid #DBDBDB;
    overflow-y: auto;
    
    &.full-width {
      border-right: none;
    }
    
    .empty-player {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      
      .empty-content {
        text-align: center;
        
        .empty-icon {
          font-size: 80px;
          color: #dcdfe6;
          margin-bottom: 24px;
        }
        
        h3 {
          font-size: 20px;
          color: #606266;
          margin: 0 0 12px;
          font-weight: normal;
        }
        
        p {
          font-size: 14px;
          color: #909399;
          margin: 0;
        }
      }
    }
  }
  
  .list-panel {
    // width: 30%;
    width: 500px;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    :deep(.el-scrollbar) {
      flex: 1;
      height: 0;
    }
  }
}
</style>