<!-- 音频播放器 -->
<script lang="ts" setup>
defineOptions({
  name: 'VoiceModal'
})
const emit = defineEmits(['callback'])
const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  isShowPopover: {
    type: Boolean,
    default: false,
  },
  // begin: {
  //   type: Number,
  //   default: 0,
  // },
  // end: {
  //   type: Number,
  //   default: 0,
  // },
  current: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    default: ''
  }
})
const data = reactive({
  currentTime: 0,
  audioContext: null,
  source: null,
  isClick: false,
  audioArrayBuffer: null,
  timer: null,
  duration: 0,
  isShow: false,
  isFirstPlay: true,
})
const audioTag = ref<HTMLAudioElement>()

// 计算
const formatCurrentTime = computed(() => {
  let minutes = Math.floor(data.currentTime / 60);
  let seconds = Math.floor(data.currentTime % 60);
  let milliseconds = Math.floor((data.currentTime % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
})
const formatEndTime = computed(() => {
  let minutes = Math.floor(data.duration / 60);
  let seconds = Math.floor(data.duration % 60);
  let milliseconds = Math.floor((data.duration % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
})

const decodeAudioData = () => {
  return new Promise((resolve, reject) => {
    data.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    fetch(props.url)
      .then(response => response.blob())
      .then(blob => {
        return blob.arrayBuffer();
      })
      .then(arrayBuffer => {
        data.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          data.audioArrayBuffer = buffer
          data.source = data.audioContext.createBufferSource();
          data.source.buffer = buffer;
          data.duration = buffer.duration;
          resolve()
        }).catch((error) => {
          console.error('Error decoding audio data:', error);
          reject(error)
        });
      })
      .catch((err) => {
        console.error(err);
        reject(err)
      });
  })
}
const syncTime = () => {
  clearInterval(data.timer)
  let times = data.currentTime
  data.timer = setInterval(() => {
    times += 0.1
    data.currentTime = times
    if (data.currentTime >= data.duration) {
      data.currentTime = data.duration
      clearInterval(data.timer)
    }
  }, 100);

}
const playAudio = () => {
  if (data.isClick) {
    return
  }
  data.isClick = !data.isClick
  // 开始播放
  if (data.isFirstPlay) {
    // 创建新的源并开始播放
    data.isFirstPlay = false
    data.currentTime = 0
    data.source = data.audioContext.createBufferSource();
    data.source.buffer = data.audioArrayBuffer;
    data.source.connect(data.audioContext.destination);
    data.source.start(0, 0, data.duration);
    data.source.onended = () => {
      console.log('音频回放结束');
      //重置状态为第一次播放
      data.isFirstPlay = true
      data.isClick = false; // 重置点击状态

    };
  } else if (data.audioContext.state === "suspended") {
    //恢复之前暂停播放的音频
    data.audioContext.resume();
  }
  syncTime()
}

const pause = () => {
  if (data.source) {
    // data.source.stop(); // 停止播放
    if (data.audioContext.state === 'running') {
      data.audioContext.suspend().then(() => {
        clearInterval(data.timer)
        data.isClick = false; // 重置点击状态
        console.log("暂停：", data.audioContext.state);
      });
    }
  }
}

const close = () => {
  if (data.audioContext) {
    data.audioContext.close();
  }

  clearInterval(data.timer)
  data.isClick = false;
  data.isFirstPlay = true

}

const changeShow = () => {
  data.isShow = !data.isShow
  console.log(data.isShow);

  emit("callback", props.id);
}

const handleShow = async () => {
  if (!data.audioContext || data.audioContext.state === "closed") {
    await decodeAudioData()
    playAudio()
  } else {
    setTimeout(() => {
      playAudio()
    }, 500);
  }
}

watch(() => props.current, (newValue) => {
  if (newValue != props.id) {
    data.isShow = false
  }
})

onMounted(() => {
  //decodeAudioData()
  //data.currentTime = 0
})
onUnmounted(() => {
  close()
})

</script>

<template>
  <el-popover
    placement="left"
    trigger="click"
    content=""
    @show="handleShow"
    @hide="close"
    v-model:visible="data.isShow"
    width="auto">
    <div class="flex items-center justify-center w-160px h-40px bg-#F3FAFD px-20px rounded-4">
      <template v-if="data.isShow">
        <Icon icon="ic:baseline-pause" v-if="data.isClick" class="pr-10px" :size="20" @click="pause" />
        <!-- <img class="w-20px h-20px pr-10px" v-if="data.isClick" src="./stop.svg" alt="" @click="pause" /> -->
        <Icon icon="ic:baseline-play-arrow" v-else class="pr-10px" :size="20" @click="playAudio" />
        <!-- <img v-else class="w-20px h-20px pr-10px" src="./play.svg" alt="" @click="playAudio" /> -->
        <span>{{ formatCurrentTime }} / {{ formatEndTime }}</span>
      </template>
    </div>
    <template #reference>
      <a>
        <Icon icon="ic:outline-play-circle" color="#409eff" :size="24" @click.stop="changeShow" />
      </a>
    </template>
  </el-popover>
</template>
