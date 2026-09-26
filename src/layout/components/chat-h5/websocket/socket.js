import { seatsCall, talkHungUp, saveRating, saveChatRecords, exitQueue } from '@/api/clientAiSeat'
import moment from 'dayjs'

// websocketService.js
let socket = null
let fromDevice = null
let timer = null
let _this = null
let CustomerService = null
let userInfo

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
fromDevice = generateUUID()
const sendSignal = (signal, fromDevice, toDevice, payload) => {
    let evtObject = { eventName: signal, eventType: '_singal', from: fromDevice, to: toDevice, payload: payload }
    const event = JSON.stringify(evtObject)
    _send(event)
}

// 发送消息的函数
export const _send = (event, messageType) => {
    try {
        // 根据不同类型的消息创建相应的消息对象
        const createMessage = (from, to, payload) => ({
            eventName: 'USER_BASE_TALK_MSG',
            eventType: '_directive',
            from,
            to,
            payload
        })

        // 如果 messageType 存在，则创建并发送普通消息
        if (messageType) {
            // 打印捕获到的客户端正常信息
            console.log('捕获客户端正常信息', event)
            const message = createMessage(fromDevice, CustomerService?.SEAT_DEVICE_ID, {
                userId: userInfo.id,
                messageContent: event.message
            })

            console.log('客户端发送的消息', message)
            makesSaveChatRecordsRequest(event.message)
            socket.send(JSON.stringify(message))
            return
        }

        // 否则，发送信令消息
        console.log('客户端发送的信令消息', event)
        socket.send(event)
    } catch (error) {
        console.log('捕获错误信息', error)
    }
}

// 处理在线客服请求的异步函数

const makeSeatsCallRequest = async status => {
    const params = {
        extProps: {
            scheduleInfo: {
                scheduleType: 'roomAreaSchedule',
                eparchyCode: '0010'
            }
        },
        USER_ID: userInfo?.id,
        USER_NAME: userInfo?.username,
        SESSION_ID: null,
        DEVICE: {
            DEVICE_ID: fromDevice
        },
        // SERIAL_NUMBER: '13505146622',
        SERIAL_NUMBER: null,
        USER_PROVINCE_CODE: '11',
        USER_EPARCHY_CODE: '0010'
    }

    const res = await seatsCall(params)
    console.log('在线接口返回值', res)

    const handleResponse = response => {
        switch (response.respCode) {
            case '0000':
                handleSuccessResponse(response)
                break
            case '01-107':
                handleWaitingResponse(response)
                break
            case '01-104':
                handleEndStateResponse(response)
                break
            case '9999':
                handleEndStateResponse(response)
                break
            default:
                _this.$toast.fail(response.respDesc || '在线异常，请重试')
        }
    }

    handleResponse(res)
}

const handleSuccessResponse = response => {
    CustomerService = response.data
    _this.serviceInformation = response.data
    console.log('当前是在线状态')
    const message = [
        {
            data: moment().format('YYYY-MM-DD HH:MM:SS'),
            value: '',
            serviceInformation: response.data,
            isMine: 'start',
            isLabor: true,
            type: 'Labor'
        },
        {
            data: moment().format('YYYY-MM-DD HH:MM:SS'),
            // message: `您好，我是人工客服${response.data.STAFF_NAME},工号${response.data.USER_EPARCHY_CODE}，有什么可以帮您？`,
            value: `您好，我是人工客服${response.data.STAFF_NAME}，有什么可以帮您？`,
            isLabor: true,
            type: 'Labor'
        }
    ]
    _this.chatedList = _this.chatedList.concat(message)
    _this.SetCommunicationState('SuccessState')
}

const handleWaitingResponse = response => {
    CustomerService = response.data
    _this.SetCommunicationState('WaitingState')
    const message = {
        data: moment().format('YYYY-MM-DD HH:MM:SS'),
        value: `当前${response.data.number ? Number(response.data.number) - 1 : '有人'}人排在您前面，${
            response.data.minuteDesc || '请耐心等待！'
        }`,
        isMine: false,
        isLabor: true,
        type: 'Labor'
    }
    _this.chatedList.push(message)
}

const handleEndStateResponse = response => {
    // const state = response.respCode == '01-104';
    debugger
    _this.SetCommunicationState('endState')
    const message = {
        data: moment().format('YYYY-MM-DD HH:MM:SS'),
        value: response.respDesc ? response.respDesc : '系统错误，请重试',
        isMine: 'close',
        isLabor: true,
        type: 'Labor'
    }
    _this.chatedList.push(message)
    disconnectFromWebSocket(true)
}

export const makeTalkHungUpRequest = async callback => {
    const params = { seatId: CustomerService?.SEAT_ID || CustomerService?.seatId, userId: userInfo?.id }

    try {
        const res = await talkHungUp(params)
        console.log('断开连接', res)

        if (res.respCode === '0000') {
            callback && callback()
            disconnectFromWebSocket()
        }
        res.respCode !== '0000' && _this.$toast.fail(res.respDesc || '断开连接失败')
    } catch (error) {
        console.log('捕获到连接断开异常', error)
    }
}

export const makeExitQueueRequest = async callback => {
    const params = { SEAT_ID: CustomerService?.seatId, USER_ID: userInfo?.id }

    try {
        const res = await exitQueue(params)
        if (res.respCode === '0000') {
            callback && callback()
            const message = {
                data: moment().format('YYYY-MM-DD HH:MM:SS'),
                value: '结束排队成功，人工客服已关闭',
                isMine: 'close',
                isLabor: true,
                type: 'Labor'
            }
            _this.chatedList.push(message)
            disconnectFromWebSocket(true)
        }
        res.respCode !== '0000' && _this.$toast.fail(res.respDesc || '结束排队服务异常')
    } catch (error) {
        console.log('捕获到结束排队服务异常', error)
    }
}

export const makeSaveRatingRequest = async data => {
    const params = { staffId: CustomerService.STAFF_ID, userId: userInfo.id, starRating: data }

    try {
        const res = await saveRating(params)
        console.log('评价结果', res)

        if (res.respCode === '0000') {
            // disconnectFromWebSocket();
        }
        res.respCode !== '0000' && _this.$toast.fail(res.respDesc || '评价失败')
    } catch (error) {
        console.log('捕获到评价结果异常', error)
    }
}

export const makesSaveChatRecordsRequest = async data => {
    const params = {
        TO_USER_ID: CustomerService.STAFF_ID,
        FROM_USER_ID: userInfo.id,
        FROM_USER_NAME: userInfo.username,
        TO_USER_NAME: CustomerService.STAFF_NAME,
        MESSAGE: data
    }
    try {
        const res = await saveChatRecords(params)
        if (res.respCode === '0000') {
        }
        res.respCode !== '0000' && _this.$toast.fail(res.respDesc || '保存消息异常')
    } catch (error) {
        console.log('捕获到保存消息异常', error)
    }
}

export function connectToWebSocket(newthis, status) {
    _this = newthis
    if (socket && socket.readyState === WebSocket.OPEN) {
        return // 如果已经连接，则不进行操作
    }
    // socket = new WebSocket('/ws')
    // socket = new WebSocket('ws://10.19.33.14:36064')
    socket = new WebSocket(process.env.VUE_APP_WEBSOCKET_URL)

    socket.onopen = () => {
        console.log('WebSocket连接已建立', newthis)
        userInfo = {
            id: '3c2dde76-099a-42fe-9a85-7e3359eeb918',
            username: 'admin'
        }
        
        makeSeatsCallRequest(status)
        sendSignal('__create', fromDevice)
        timer = setInterval(() => {
            sendSignal('__ping', fromDevice)
        }, 3000)
    }

    socket.onmessage = event => {
        const messages = JSON.parse(event.data)
        // 处理接收到的消息
        console.log('客户端收到消息', messages, event)

        if (messages.eventName === 'USER_BASE_TALK_MSG') {
            console.log('客户端发送消息', messages)

            const message = {
                data: moment().format('YYYY-MM-DD HH:mm:ss'),
                value: messages.payload.messageContent,
                isMine: false,
                isLabor: true,
                type: 'Labor'
            }

            _this.chatedList.push(message)
        } else if (messages.eventName == 'QUEUE_SUCCESS') {
            CustomerService = messages.payload
            _this.serviceInformation = messages.payload
            const message = [
                {
                    data: moment().format('YYYY-MM-DD HH:mm:ss'),
                    value: '排队成功，正在为您接入人工客服!',
                    isMine: false,
                    isLabor: true,
                    type: 'Labor'
                },
                {
                    data: moment().format('YYYY-MM-DD HH:mm:ss'),
                    value: '',
                    isMine: 'start',
                    isLabor: true,
                    type: 'Labor'
                },
                {
                    data: moment().format('YYYY-MM-DD HH:mm:ss'),
                    value: `您好，我是人工客服${CustomerService.STAFF_NAME},有什么可以帮您？`,
                    isMine: false,
                    isLabor: true,
                    type: 'Labor'
                }
            ]

            _this.chatedList = [..._this.chatedList, ...message]
            _this.SetCommunicationState('SuccessState')
            console.log('排队成功', _this.chatedList)
        } else if (messages.eventName == 'EXIT_ROOM') {
            const status = messages.payload.roomMemberList.some(item => item.userId === userInfo.id)
            if (status) {
                _this.SetCommunicationState('endState')
                const message = {
                    data: moment().format('YYYY-MM-DD HH:mm:ss'),
                    value: '人工服务结束',
                    isMine: 'close',
                    isLabor: true,
                    type: 'Labor'
                }
                _this.chatedList.push(message)
                disconnectFromWebSocket()
            }
            console.log('服务结束', messages)
        } else if (messages.eventName == 'JOIN_ROOM') {
            console.log('有人进入房间', messages)
            setTimeout(() => {
                console.log('当前客服信息', CustomerService)
                messages.payload.roomMemberList.map(item => {
                    if (item.userId == CustomerService.STAFF_ID) {
                        CustomerService.SEAT_DEVICE_ID = item.deviceId
                    }
                })
            }, 1000)
        } else if (messages.eventName == 'KF_OFF_LINE') {
            const message = [
                {
                    data: moment().format('YYYY-MM-DD HH:mm:ss'),
                    value: '客服离线，即将结束服务!',
                    isMine: false,
                    isLabor: true,
                    type: 'Labor'
                }
            ]
            _this.chatedList = [..._this.chatedList, ...message]
        }
    }
    socket.onclose = () => {
        console.log('WebSocket连接已关闭')
        _this.SetChangeAgentStatus(false)
        socket = null
        clearInterval(timer)
        timer = null
        debugger
        if (_this.communicationState !== 'endState') {
            const message = {
                data: moment().format('YYYY-MM-DD HH:mm:ss'),
                value: '连接失败，请重试',
                isMine: 'close',
                isLabor: true,
                type: 'Labor'
            }
            _this.chatedList.push(message)
            _this.SetCommunicationState('initialize')
        }
    }
}

export function disconnectFromWebSocket(type) {
    if (socket) {
        if (!type) {
            makeTalkHungUpRequest()
        }
        socket.close()
        socket = null
        clearInterval(timer)
        timer = null
        console.log('连接断开')
    }
}
