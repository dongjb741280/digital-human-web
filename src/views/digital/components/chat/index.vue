<script setup lang="ts">
import user from '@/assets/imgs/default-avatar.png'
import assistant from '@/assets/imgs/robot1.png'
import { useQa } from './useQa'
import { useTodo } from './useTodo'
import VoiceRecording from './VoiceRecording.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const questionType = ref('0') // 0 知识问答 1 待办任务
const isVoice = ref(false)

type ChatList = {
  role: 'user' | 'assistant'
  content: string
  btns?: any[]
  cards?: any[]
  lessonButtons?: any[]
}
const temlate: ChatList = {
  role: 'assistant',
  content: '您好，我是AI助手小通，有什么可以帮您？',
  btns: [
    // {
    //   dataName: '智能问答',
    //   dataId: '2'
    // },
    // {
    //   dataName: '小B助手',
    //   dataId: '4'
    // },
    // {
    //   dataName: '智家助手',
    //   dataId: '3'
    // },
    // {
    //   dataName: '智慧客服',
    //   dataId: '6'
    // },
    // {
    //   dataName: '反诈服务',
    //   dataId: '5'
    // },
    // // {
    // //   dataName: '营销助手',
    // //   dataId: '7'
    // // }
    // {
    //   dataName: '党建助手',
    //   dataId: '8'
    // }
  ],
  cards: []
}
const dataList = ref<ChatList[]>([])
const isSending = ref(false)
// dataList.value.push(temlate)
const emits = defineEmits(['onShowModal', 'onCloseModal', 'getIsSending'])
const inputmessage = ref('')
const inputType = ref('9')
const { handleTaskItemClick } = useTodo(inputType, dataList, inputmessage, emits)
const { sendQuestion, onStopSpeech } = useQa(inputType, dataList, inputmessage, isSending, emits)
const chatListContainer = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (chatListContainer.value) {
    chatListContainer.value.scrollTop = chatListContainer.value.scrollHeight
  }
})
onUpdated(() => {
  if (chatListContainer.value) {
    chatListContainer.value.scrollTop = chatListContainer.value.scrollHeight
    chatListContainer.value.style.scrollBehavior = 'smooth'
  }
})
const handleInputFocus = () => {
  console.log('handleInputFocus')
}
const handleInputBlur = () => {
  console.log('handleInputBlur')
}
const handleSend = () => {
  console.log('handleSend')

  dataList.value.push({
    role: 'user',
    content: inputmessage.value,
    btns: []
  })
  dataList.value.push({
    role: 'assistant',
    content: 'typing',
    btns: []
  })
  if (questionType.value === '1') {
    handleTaskItemClick()
    return
  } else {
    sendQuestion()
  }

  inputmessage.value = ''
}

const handleCtrlEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleCtrlEnter)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleCtrlEnter)
})

const onBtnClick = (item) => {
  // emits('onShowModal', item)
  inputType.value = item.dataId
  if (item.dataId === '3' || item.dataId === '4') {
    questionType.value = '1'
  } else {
    questionType.value = '0'
  }
}
const onCardClick = (card) => {
  if (questionType.value === '1') {
    handleTaskItemClick(card)
  }
}
const handoff = () => {
  dataList.value.push(temlate)
}
const handleText = (text: string) => {
  inputmessage.value = text
  handleSend()
}

// 处理课程按钮点击
const onLessonButtonClick = (lesson) => {
  // 关闭弹窗
  // emits('onCloseModal');
  // 在新窗口打开视频页面
  window.open(`/studio?lessonId=${lesson.lessonId}`, '_blank');
}
watch(() => isSending.value, (val) => {
  emits('getIsSending', val)
})
</script>
<template>

  <!-- <div class="flex flex-col items-center min-w-19rem">
    <div
      class="flex flex-col overflow-hidden w-full h-full text-size-14 font-400 line-height-1.5 text-#333"
    >
      <div class="flex flex-col h-full"> -->
  <div class="flex flex-col items-center min-w-19rem h-full chat_container">
    <div class="flex flex-col overflow-hidden w-full h-full text-size-14 font-400 line-height-1.5 text-#333">
      <div class="flex flex-col h-full">
        <div class="overflow-y-scroll p-8px chat-list-container flex flex-1 flex-col min-h-13rem"
          ref="chatListContainer">
          <template v-for="item in dataList" :key="item">
            <div v-if="item.role === 'assistant' && item.content === 'typing'" class="flex flex-row">
              <img :src="assistant" alt="" class="w-30px h-30px rounded-full mr-0" />
              <div
                class="flex items-center mt-4px h-[1.25rem] transition-opacity max-w-680px min-w-1px ml-8px bg-white rounded-12px rounded-lt-0 px-16px py-12px">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
            </div>
            <div v-else class="flex flex-row items-start mt-5px not-first:mt-12px"
              :class="{ 'flex-row-reverse ': item.role === 'user' }">
              <img v-if="item.role != 'user'" :src="item.role === 'user' ? user : assistant" alt=""
                class="w-36px h-36px rounded-full mr-12px" :class="{ 'ml-8px mr-0': item.role === 'user' }" />
              <div class="flex flex-col">
                <div class="max-w-680px min-w-1px bg-white rounded-12px rounded-lt-0 px-10px py-8px"
                  style="margin-top: 4px; margin-left: -2px;"
                  :class="{ 'rounded-lt-12px rounded-rt-0 bg-jianbian': item.role === 'user' }">
                  <div class="overflow-hidden min-h-21px font-400 text-14px text-#333 line-height-normal answer_content"
                    :class="{ 'text-#fff': item.role === 'user' }" v-html="item.content" />
                  <!-- {{ item.content }} -->
                </div>
                <div class="w-full flex flex-wrap gap-1 pt-10px" v-if="item.btns && item.btns?.length > 0">
                  <template v-for="(btns, index1) in item.btns" :key="index1">
                    <div
                      class="inline-flex items-center px-10px py-5px cursor-pointer border-solid line-height-normal border border-#3d6bff text-12px text-center align-middle ws-nowrap select-none rounded-16px bg-white text-#3d6bff hover:border-transparent hover:shadow-md"
                      @click="onBtnClick(btns)">
                      {{ btns.dataName }}
                      <Icon v-if="btns.dataId === inputType" icon="system-uicons:check" :size="12" color="#3d6bff" />
                    </div>
                  </template>
                </div>
                <!-- 课程按钮 -->
                <div class="w-full flex flex-wrap gap-1 pt-10px"
                  v-if="item.lessonButtons && item.lessonButtons?.length > 0">
                  <template v-for="(lesson, index) in item.lessonButtons" :key="index">
                    <div
                      class="inline-flex items-center px-10px py-5px cursor-pointer border-solid line-height-normal border border-#3d6bff text-12px text-center align-middle ws-nowrap select-none rounded-16px bg-white text-#3d6bff hover:border-transparent hover:shadow-md"
                      @click="onLessonButtonClick(lesson)">
                      {{ lesson.title }}
                    </div>
                  </template>
                </div>
                <div class="rounded-lb-12px rounded-rb-12px mt--10px bg-white shadow-sm"
                  v-if="item.cards && item.cards?.length > 0">
                  <ol class="line-height-normal" style="margin-block: 10px">
                    <li class="cursor-pointer text-size-14px text-#3d6bff p-5px" v-for="card in item.cards"
                      :key="card.id" @click="onCardClick(card)">{{ card.title }}</li>
                  </ol>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- <div class="flex flex-row items-center">
          <div
            class="ml-15px flex items-center bg-white rounded-full py-5px px-10px text-12px w-[fit-content] gap-5px cursor-pointer border-transparent border-solid border hover:border-#3d6bff"
            @click="onStopSpeech"
          >
            <Icon class="color-#3d6bff" icon="pepicons-print:circle-big-circle-filled" :size="12" />
            <span>停止播报</span>
          </div>
          <div
            class="ml-15px flex items-center bg-white rounded-full py-8px px-10px text-12px w-[fit-content] gap-5px cursor-pointer border-transparent border-solid border hover:border-#3d6bff"
            @click="handoff"
            >场景切换</div
          >
        </div> -->
        <div class="flex items-center min-h-10 m-10px ">
          <div class="flex flex-1 items-center relative w-full h-full">
            <textarea v-model="inputmessage" @focus="handleInputFocus" @blur="handleInputBlur"
              @keydown.enter.prevent="handleSend"
              style="box-shadow: 0px 3px 8px 0px rgba(193, 225, 234, 0.5); border-radius: 8px;"
              class="accent-#3d6bff box-border overflow-hidden outline-none resize-none border-none transition-border-color p-12px w-full flex-1 line-height-5 absolute"
              type="text" :rows="1" placeholder="请输入您想咨询的内容"></textarea>
            <div v-if="!isVoice" class="send-btn" @click="handleSend">
              <Icon icon="svg-icon:dh-send" :size="18" color="#fff" />
            </div>
            <!-- <VoiceRecording @text="handleText" class="w-full h-full flex-1 absolute z-1" v-if="isVoice" /> -->
          </div>
          <!-- <Icon icon="material-symbols:keyboard" :size="24" /> -->
          <!-- <div class="cursor-pointer color-#3d6bff mr-10px" @click="() => (isVoice = !isVoice)">
            <Icon v-if="!isVoice" icon="material-symbols:mic" :size="24" />
            <Icon v-else icon="material-symbols:keyboard" :size="24" />
          </div> -->

        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.chat_container {
  .chat-list-container {
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .chat-list-container::-webkit-scrollbar {
    display: none;
  }

  .typing-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-left: 5px;
    border-radius: 50%;
    background: #3d6bff;
    -webkit-animation: animate-typing-dot 0.9s linear infinite;
    animation: animate-typing-dot 0.9s linear infinite;
  }

  .typing-dot:first-child {
    margin: 0;
    opacity: 0.9;
  }

  .typing-dot:nth-child(2) {
    opacity: 0.3;
    -webkit-animation-delay: 0.225s;
    animation-delay: 0.225s;
  }

  .typing-dot:nth-child(3) {
    opacity: 0.6;
    -webkit-animation-delay: 0.45s;
    animation-delay: 0.45s;
  }

  @keyframes animate-typing-dot {
    0% {
      transform: translateY(0);
    }

    25% {
      transform: translateY(6px);
    }

    50% {
      transform: translateY(0);
    }

    75% {
      transform: translateY(-6px);
    }

    to {
      transform: translateY(0);
    }
  }

  .answer_content p {
    &:nth-child(1){
      margin-top: 0;
    }
  }

  /* 思考过程的样式 */
  .thinking-process {
    padding: 4px 8px;
    border-radius: 8px;
    background: rgb(233, 244, 254);
  }
  .thinking-content{
    font-size: 13px;
    margin-top: 4px;
  }

  /* Markdown样式 */
  :deep(h1) {
    font-size: 1.5em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  :deep(h2) {
    font-size: 1.3em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  :deep(h3) {
    font-size: 1.1em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  :deep(p) {
    margin-bottom: 0.5em;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.5em;
    margin-bottom: 0.5em;
  }

  :deep(li) {
    margin-bottom: 0.2em;
  }

  :deep(code) {
    background-color: #f0f0f0;
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    background-color: #f0f0f0;
    padding: 0.5em;
    border-radius: 4px;
    overflow-x: auto;
    margin-bottom: 0.5em;
  }

  :deep(pre code) {
    background-color: transparent;
    padding: 0;
  }

  :deep(blockquote) {
    border-left: 3px solid #d0d0d0;
    padding-left: 0.5em;
    color: #666;
    margin-left: 0.5em;
    margin-bottom: 0.5em;
  }

  :deep(strong) {
    font-weight: bold;
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(a) {
    color: #3d6bff;
    text-decoration: none;
  }

  :deep(a:hover) {
    text-decoration: underline;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 0.5em;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid #d0d0d0;
    padding: 0.3em 0.5em;
    text-align: left;
  }

  :deep(th) {
    background-color: #f0f0f0;
  }

  .bg-jianbian {
    background: var(--dh-gradient);
  }

  .send-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    margin-left: auto;
    margin-right: 6px;
    flex-shrink: 0;
    border-radius: 50%;
    cursor: pointer;
    background: var(--dh-gradient);
    box-shadow: var(--dh-shadow-md);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--dh-shadow-lg);
    }
  }
}
</style>
