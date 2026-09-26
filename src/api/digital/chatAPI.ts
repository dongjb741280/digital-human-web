import request from '@/config/axios'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getAccessToken, getRefreshToken, getTenantId, removeToken, setToken } from '@/utils/auth'


const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'

export const getQuestionByToDo = async (data) => {
  return await request.post({ url: `${prefix}/workflow/getDialogueWorkflowQaInfo`, data })
}

export const getQuestion = async (data) => {
  return await request.post({ url: `${prefix}/aiAgent/getDialogueHumanQaInfo`, data })
}


// 修改函数签名以接受 onclose 和 signal
export const getQuestionHm = async (data, onMessage, onError, onClose, signal) => {
  const uniqueRequestId = data.uniqueRequestId;
  // const url = `http://localhost:10086/getDigitalHumansStream?uniqueRequestId=${uniqueRequestId}`; // 使用本地地址
  const url = `${prefix}/workflow/getDigitalHumansStream?uniqueRequestId=${uniqueRequestId}`; // 使用环境变量地址


  return fetchEventSource(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer ' + getAccessToken()
    },
    body: JSON.stringify(data),
    signal: signal, // 传递 AbortSignal
    onmessage: onMessage,
    onerror: onError,
    onclose: onClose, // 添加 onclose 回调处理
    openWhenHidden: true, // 明确设置：即使标签页隐藏也尝试保持连接或恢复
    // 或者如果你不希望标签页隐藏时保持连接，并且不希望切换回来时自动重连，可以尝试 false:
    // openWhenHidden: false,
    retry: 0 // 禁用重试
  })
}

export const getVoice2Tx = async (data) => {
  return await request.upload({ url: `${prefix}/voiceManager/voice2Txt`, data })
}
