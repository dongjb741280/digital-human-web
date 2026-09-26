/*
 * 事件类型
 */
// 选择模式
export enum SelectMode {
  EMPTY = '',
  ONE = 'one',
  MULTI = 'multiple'
}

// 选择事件（用于广播）
export enum SelectEvent {
  ONE = 'selectOne',
  MULTI = 'selectMultiple',
  CANCEL = 'selectCancel'
}

export default { SelectMode, SelectEvent }
