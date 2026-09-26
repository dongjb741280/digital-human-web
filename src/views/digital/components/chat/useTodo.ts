import { getQuestionByToDo } from '@/api/digital/chatAPI'

type TodoItem = {
  task_id: string
  task_name: string
  task_state: string
  task_node: string
  remark: string
}
export const useTodo = (
  inputType: Ref<string>,
  dataList: Ref<any[]>,
  inputmessage: Ref<string>,
  emits
) => {
  const todoList = ref<TodoItem[]>([])
  const taskId = ref('')
  const formData = ref<any[]>([])
  const handleToDoClick = async () => {
    dataList.value.push({
      role: 'user',
      content: '待办任务',
      btns: []
    })
    addTyping()
    const params = {
      id: inputType.value,
      inputObj: {
        taskId: '',
        query: ''
      },
      type: '1'
    }
    try {
      const resp = await getQuestionByToDo(params)
      console.log(resp)
      todoList.value = resp.answerInfo.result
      dataList.value = dataList.value.filter((item) => item.content !== 'typing')
      dataList.value.push({
        role: 'assistant',
        content: resp.answerInfo.answer,
        btns: [],
        cards: todoList.value.map((item) => ({
          id: item.task_id,
          title: item.task_name,
          type: 'todo'
        }))
      })
    } catch (error) {
      dataList.value = dataList.value.filter((item) => item.content !== 'typing')
      dataList.value.push({
        role: 'assistant',
        content: '抱歉，我不知道这个问题的答案',
        btns: [],
        cards: []
      })
    }
  }
  const handleTaskItemClick = async (item?: any) => {
    if (item) {
      taskId.value = item?.id || ''
      dataList.value.push({
        role: 'user',
        content: item.title,
        btns: [],
        cards: []
      })
    }
    addTyping()
    const params = {
      id: inputType.value,
      inputObj: {
        taskId: taskId.value || '',
        query: inputmessage.value || ''
      },
      type: '1'
    }
    try {
      inputmessage.value = ''
      const resp = await getQuestionByToDo(params)
      dataList.value = dataList.value.filter((item) => item.content !== 'typing')
      if (resp.answerInfo.type === '1' && resp.answerInfo.result.length > 0) {
        todoList.value = resp.answerInfo.result
      } else {
        todoList.value = []
      }

      dataList.value.push({
        role: 'assistant',
        content: resp.answerInfo.answer,
        btns: [],
        cards: todoList.value.map((item) => ({
          id: item.task_id,
          title: item.task_name,
          type: 'todo'
        }))
      })
      // 判断是否 IFrame
      if ('5' === resp.answerInfo.type) {
        emits('onShowModal', {})
      }
      // 判断 是否有表单
      if ('3' === resp.answerInfo.type) {
        formData.value = resp.answerInfo.result || []
        emits('onShowModal', { dataType: 'form', data: resp.answerInfo.result })
      }
      if ('4' === resp.answerInfo.type) {
        const tableData = resp.answerInfo.result
        if (tableData && formData.value.length > 0) {
          formData.value = formData.value.map((item: any) => {
            item.children.map((child: any) => {
              child.value = tableData[child.label] || child.value || ''
              return child
            })
            return item
          })
          emits('onShowModal', { dataType: 'form', data: formData.value })
        }
      }
    } catch (error) {
      dataList.value = dataList.value.filter((item) => item.content !== 'typing')
      dataList.value.push({
        role: 'assistant',
        content: '抱歉，我不知道这个问题的答案',
        btns: [],
        cards: []
      })
    }
  }
  const addTyping = () => {
    // 判断 typing 是否存在
    if (dataList.value.find((item) => item.content === 'typing')) return
    dataList.value.push({
      role: 'assistant',
      content: 'typing',
      btns: []
    })
  }
  onMounted(() => {
    // handleToDoClick()
  })
  return {
    handleToDoClick,
    handleTaskItemClick
  }
}
