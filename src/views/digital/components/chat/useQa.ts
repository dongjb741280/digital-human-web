import { getQuestion, getQuestionHm } from '@/api/digital/chatAPI'
import { tr } from 'element-plus/es/locale';
import { ref, Ref, onMounted, shallowRef } from 'vue' // 确保导入 ref 和 shallowRef
import { marked } from 'marked'; // 导入marked库

export const useQa = (
  inputType: Ref<string>,
  dataList: Ref<any[]>,
  inputmessage: Ref<string>,
  isSending: Ref<boolean>,
  emits
) => {
  // 使用 shallowRef 存储 AbortController 实例，避免深度响应式代理
  const currentAbortController = shallowRef<AbortController | null>(null);
  let currentAudio: HTMLAudioElement | null = null

  // 播放答案语音（后端克隆音色 TTS 返回的音频地址）
  const playAudio = (url: string) => {
    try {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio = null
      }
      const audio = new Audio(url)
      currentAudio = audio
      audio.play().catch((e) => console.warn('语音播报失败:', e))
    } catch (e) {
      console.warn('语音播报失败:', e)
    }
  }

  const sendQuestion = async () => {
    if (!inputmessage.value.trim()) return // 防止发送空消息
    isSending.value = true // 开始发送
    // 如果已有请求在进行中，先中止它
    if (currentAbortController.value) {
      currentAbortController.value.abort();
    }
    // 中止上一次的语音播报
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    // 创建新的 AbortController
    const controller = new AbortController();
    currentAbortController.value = controller;


    const params = {
      query: inputmessage.value,
      inputObj: {},
      type: '1', // 根据实际需要调整
      conversation_id: '', // 可能需要维护会话ID
      id: 10, // 根据实际需要调整,
      uniqueRequestId: crypto.randomUUID() // 添加唯一ID
    }
    inputmessage.value = '' // 清空输入框

    // 添加助手消息占位符
    const assistantMessageIndex = dataList.value.length-1
    // dataList.value.push({
    //   role: 'assistant',
    //   content: '...', // 初始占位符内容
    //   lessonButtons: []
    // })

    let accumulatedContent = ''
    let currentLessonButtons = []
    let renderTimer: ReturnType<typeof setTimeout> | null = null

    // 将累计内容渲染到气泡（含 details / lessonId / markdown 处理）
    const render = () => {
      let displayContent = accumulatedContent
      currentLessonButtons = []
      if(displayContent.includes('$$$$')){
        displayContent = displayContent.replace(/\$\$\$\$/g, '\n');
      }
      // 1. 处理 </details> 结束标签 (修改部分)
      // 检查是否存在没有起始标签的 </details> 结束标签
      const detailsEndMatch = displayContent.match(/^(.*?)<\/details>\s*/s)
      if (detailsEndMatch) {
        // 提取思考过程内容（从开始到 </details> 之前的所有内容）
        const thinkingContent = detailsEndMatch[1]

        // 创建带有样式的折叠区域
        const replacement = `<div class="thinking-process">
                <details class="thinking-details">
                  <summary class="thinking-summary">查看思考过程</summary>
                  <div class="thinking-content">${thinkingContent}</div>
                </details>
              </div>`

        // 替换原始内容（从开始到 </details> 的所有内容）
        displayContent = displayContent.replace(detailsEndMatch[0], replacement)
      }

      // 处理完整的 <details>...</details> 标签对（如果有的话）
      const detailsPattern = /<details>([\s\S]*?)<\/details>/g
      let detailsMatch

      while ((detailsMatch = detailsPattern.exec(displayContent)) !== null) {
        const fullMatch = detailsMatch[0]
        const detailsContent = detailsMatch[1]

        // 创建带有样式的折叠区域
        const replacement = `<div class="thinking-process">
                <details class="thinking-details">
                  <summary class="thinking-summary">查看思考过程</summary>
                  <div class="thinking-content">${detailsContent}</div>
                </details>
              </div>`

        // 替换原始内容
        displayContent = displayContent.replace(fullMatch, replacement)

        // 重置正则表达式的 lastIndex，因为我们修改了字符串
        detailsPattern.lastIndex = 0
      }



      // 2. 处理 <lessonId> 标签 (在可能被修改过的 displayContent 上操作)
      const lessonIdMatches = displayContent.match(/<lessonId>(\d+)\|\|([^<]+)<\/lessonId>/g)
      if (lessonIdMatches && lessonIdMatches.length > 0) {
        currentLessonButtons = lessonIdMatches.map(match => {
          const lessonMatch = match.match(/<lessonId>(\d+)\|\|([^<]+)<\/lessonId>/)
          return lessonMatch ? { lessonId: lessonMatch[1], title: lessonMatch[2] } : null
        }).filter(Boolean)

        // 从显示内容中移除 lessonId 标签
        lessonIdMatches.forEach(match => {
          displayContent = displayContent.replace(match, '')
        })
      }

      // 将Markdown格式转换为HTML
      try {
        // 修改正则表达式，确保匹配完整的嵌套结构
        const htmlRegex = /<div class="thinking-process">[\s\S]*?<\/details>\s*<\/div>/g;
        const htmlParts = [];
        const markdownParts = [];

        let lastIndex = 0;
        let match;

        // 提取所有HTML部分
        while ((match = htmlRegex.exec(displayContent)) !== null) {
          if (match.index > lastIndex) {
            // 添加HTML之前的Markdown部分
            markdownParts.push({
              type: 'markdown',
              content: displayContent.substring(lastIndex, match.index),
              index: markdownParts.length + htmlParts.length
            });
          }

          // 添加HTML部分
          htmlParts.push({
            type: 'html',
            content: match[0],
            index: markdownParts.length + htmlParts.length
          });

          lastIndex = match.index + match[0].length;
        }

        // 添加最后一部分Markdown（如果有）
        if (lastIndex < displayContent.length) {
          markdownParts.push({
            type: 'markdown',
            content: displayContent.substring(lastIndex),
            index: markdownParts.length + htmlParts.length
          });
        }

        // 将所有Markdown部分转换为HTML
        markdownParts.forEach(part => {
          part.content = marked(part.content);
        });

        // 合并所有部分（按原始顺序）
        const allParts = [...markdownParts, ...htmlParts].sort((a, b) => a.index - b.index);
        displayContent = allParts.map(part => part.content).join('');
      } catch (error) {
        console.error('Markdown解析错误:', error);
        // 如果解析失败，保留原始内容
      }

      // 更新 dataList 中的助手消息
      const assistantMessage = dataList.value[assistantMessageIndex];
      if (assistantMessage) { // 确保对象存在
        assistantMessage.content = displayContent.trim(); // 直接修改 content
        assistantMessage.lessonButtons = currentLessonButtons; // 直接修改 lessonButtons
      }
    }

    // 节流渲染：快速到达的 token 合并到一次渲染，避免逐 token 重绘导致卡顿/成块输出
    const scheduleRender = () => {
      if (renderTimer) return
      renderTimer = setTimeout(() => {
        renderTimer = null
        render()
      }, 50)
    }

    const flushRender = () => {
      if (renderTimer) {
        clearTimeout(renderTimer)
        renderTimer = null
      }
      if (accumulatedContent) {
        render()
      }
    }

    try {
      // 注意：fetchEventSource 本身不直接返回完整响应体，错误和消息通过回调处理
      await getQuestionHm(
        params,
        (res) => {
          if (res.event === 'audio') {
            playAudio(res.data)
          } else if (res.data) {
            accumulatedContent += res.data
            scheduleRender()
          } else {
            isSending.value = false
          }
        },
        (error) => {
          isSending.value = false
          // 检查错误是否是由于中止操作引起的
          if (error?.name === 'AbortError') {
            console.log('Fetch aborted successfully.');
            // return; // 如果是主动中止，则不视为错误
          }

          console.error('SSE Error:', error)
          if (currentAbortController.value) {
            currentAbortController.value.abort();
          }
          currentAbortController.value = null;
          throw new Error('SSE Error') // 抛出错误，让调用者处理
        },
        () => { // onclose 回调
          console.log('SSE connection closed.');
          flushRender()
          if (currentAbortController.value) {
            currentAbortController.value.abort();
          }
          currentAbortController.value = null;
          isSending.value = false
        },
        controller.signal // 传递 signal
      )
    } catch (error) {
      // 这个 catch 主要捕获 fetchEventSource 连接建立前的错误
      console.error('Error sending question:', error)
      setErrorMessage('抱歉，发送请求失败')
      // 如果占位消息还存在，更新它或移除它
       if (dataList.value[assistantMessageIndex]?.role === 'assistant' && dataList.value[assistantMessageIndex]?.content === '...') {
         dataList.value.splice(assistantMessageIndex, 1); // 移除未更新的占位符
       }
    } finally {
       flushRender()
       // 如果占位符内容仍然是初始的 "..."，说明可能没有收到任何消息
       if (dataList.value[assistantMessageIndex]?.role === 'assistant' && dataList.value[assistantMessageIndex]?.content === '...') {
           dataList.value[assistantMessageIndex].content = '未能获取到回复。';
       }
    }
  }

  const onStopSpeech = () => {
    console.log('Stopping speech/SSE request...');
    if (currentAbortController.value) {
      currentAbortController.value.abort(); // 调用 abort 来停止请求
      currentAbortController.value = null; // 清除引用
    } else {
      console.warn('No active SSE request to stop.');
    }
  }

  const setErrorMessage = (errorMsg) => {
    // 移除可能存在的 "..." 占位符
    const typingIndex = dataList.value.findIndex(item => item.role === 'assistant' && item.content === '...')
    if (typingIndex > -1) {
        dataList.value.splice(typingIndex, 1)
    }
    dataList.value.push({
      role: 'assistant',
      content: errorMsg,
      btns: [] // 保持一致性
    })
  }

  const init = (data) => {
    // 初始加载是否也需要流式？如果不是，保持 getQuestion
    getQuestion(data).then(resp => {
       if (resp.code === 0 && resp.answerInfo) {
           dataList.value.push({
               role: 'assistant',
               content: resp.answerInfo
           });
       } else {
           // 处理初始化失败
       }
    }).catch(error => {
        console.error("Initialization failed:", error);
        // 处理初始化错误
    });
  }

  onMounted(() => {
    // 初始问候语，如果需要，可以调用 init
    // init({
    //   query: '您好，我是数字人智能助理，有什么可以帮您的？',
    //   inputObj: {},
    //   type: '1',
    //   conversation_id: '',
    //   id: 2
    // })
  })


  return {
    sendQuestion,
    onStopSpeech
  }
}
