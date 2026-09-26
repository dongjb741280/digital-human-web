<template>
  <el-dialog v-model="dialogVisible" :width="600" :close-on-click-modal="false" :show-close="false" :top="'250px'">
    <div>
      <!-- <h2>{{ document.topic }}</h2>
      <p class="status">状态: {{ getStatusText(document.status) }}</p> -->

      <div style="display: flex; align-items: center; justify-content: center;">
        <div class="progress-image">
          <img src="@/assets/imgs/Spinner.gif" alt="加载中" style="width: 40px; height: 40px;" />
        </div>
        <h1 class="progress-text" style="font-size: 18px; margin-left: 10px;">{{ Math.round(progress * 100) }}% - {{ progressMessage }}</h1>
      </div>
      <p v-if="proctype === 1" class="info">数智助手正在努力创作演讲稿，请耐心等待...</p>
      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: `${progress * 100}%` }"></div>
      </div>

      <!-- 添加动画效果 -->
      <!-- <div class="processing-animation">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div> -->


    </div>
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({ name: 'Results' })

// const props = defineProps(['proctype'])
// const { proctype } = toRefs(props);

const dialogVisible = ref(false)
const progress = ref(0)
const timer = ref<number | null>(null)
const proctype = ref(1)

// 根据proctype计算提示信息
const processTypeTimeMiao = computed(() => {
  switch (proctype.value) {
    case 1:
      return 300
    case 2:
      return 60
    case 3:
      return 180
    case 4:
      return 60
    default:
      return 300
  }
})

// const processTypeTime = computed(() => {
//   switch (proctype.value) {
//     case 1:
//       return 5
//     case 2:
//       return 1
//     case 3:
//       return 3
//     case 4:
//       return 1
//     default:
//       return 5
//   }
// })


// 启动进度条，5分钟内完成
const startProgressTimer = () => {
  // 清除可能存在的旧定时器
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  // 设置初始值
  progress.value = 0.01

  // 计算每次增加的量：5分钟 = 300秒，每5秒增加约0.0167
  // const increment = processTypeTime.value / processTypeTimeMiao.value
  const increment = 1 / processTypeTimeMiao.value * 5

  // 设置定时器，每5秒更新一次
  timer.value = setInterval(() => {
    if (progress.value < 1) {
      progress.value = Math.min(progress.value + increment, 1)
    } else {
      // 达到100%后清除定时器
      if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
      }
    }
  }, 5000)
}
const document = ref({
  topic: '文档生成中',
  status: 'processing'
})

const progressMessage = computed(() => {
  if (progress.value == 0) return '处理文档失败...'
  if (progress.value < 0.3) return '正在准备文档...'
  if (progress.value < 0.6) return '正在生成内容...'
  if (progress.value < 0.9) return '正在优化格式...'
  return '即将完成...'
})

const getStatusText = (status: string) => {
  const statusMap = {
    processing: '处理中',
    completed: '已完成',
    failed: '失败'
  }
  return statusMap[status] || status
}

// 暴露方法给父组件
defineExpose({
  show: (type) => {
    proctype.value = type
    dialogVisible.value = true
    document.value.status = 'processing'
    startProgressTimer()
  },
  hide: () => {
    dialogVisible.value = false
  },
  updateProgress: (value: number) => {
    progress.value = value
  },
  updateStatus: (status: string) => {
    document.value.status = status
  },
  success: () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
    progress.value = 1
    document.value.status = 'completed'
    // 延迟2秒后关闭结果对话框
    setTimeout(() => {
      dialogVisible.value = false
    }, 2000)

  },
  fail: () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
    progress.value = 0
    document.value.status = 'failed'
    // 延迟2秒后关闭结果对话框
    setTimeout(() => {
      dialogVisible.value = false
    }, 5000)
  }


})
</script>

<style scoped>
.results-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.loading,
.error {
  text-align: center;
  margin: 40px 0;
}

.document-result {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.status {
  font-weight: bold;
  margin: 15px 0;
}

.error {
  color: #f44336;
}

.success {
  color: #4CAF50;
}

.progress-container {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin: 20px 0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.5s ease;
}

.progress-text {
  text-align: center;
  margin-bottom: 20px;
}

.info {
  color: #666;
  font-style: italic;
  text-align: center;
}

.document-actions {
  display: flex;
  gap: 15px;
  margin: 25px 0;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border: none;
  margin: 5px;
}

.download {
  background-color: #4CAF50;
  color: white;
}

.preview {
  background-color: #2196F3;
  color: white;
}

.secondary {
  background-color: #9e9e9e;
  color: white;
}

.processing-animation {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: #4CAF50;
  border-radius: 50%;
  margin: 0 5px;
  animation: pulse 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.5s;
}

.dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4CAF50;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>