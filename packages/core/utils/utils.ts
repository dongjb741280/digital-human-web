/*
 * 工具文件
 */
import { v4 as uuid } from 'uuid'
import { useClipboard, useFileDialog, useBase64 } from '@vueuse/core'
import { ElMessage } from 'element-plus'

/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file: File | Blob): Promise<FileReader['result']> {
  return useBase64(file).promise.value
}

/**
 * @description: 选择文件
 * @param {Object} options accept = '', capture = '', multiple = false
 * @return {Promise}
 */
export function selectFiles(options: {
  accept?: string
  capture?: string
  multiple?: boolean
}): Promise<FileList | null> {
  return new Promise((resolve) => {
    const { onChange, open } = useFileDialog(options)
    onChange((files) => {
      resolve(files)
    })
    open()
  })
}

/**
 * @description: 创建图片元素
 * @param {String} str 图片地址或者base64图片
 * @return {Promise} element 图片元素
 */
export function insertImgFile(str: string) {
  return new Promise((resolve) => {
    const imgEl = document.createElement('img')
    imgEl.src = str
    // 插入页面
    document.body.appendChild(imgEl)
    imgEl.onload = () => {
      resolve(imgEl)
    }
  })
}

/**
 * Copying text to the clipboard
 * @param source Copy source
 * @param options Copy options
 * @returns Promise that resolves when the text is copied successfully, or rejects when the copy fails.
 */
export const clipboardText = async (
  source: string,
  options?: Parameters<typeof useClipboard>[0]
) => {
  try {
    await useClipboard({ source, ...options }).copy()
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
    throw error
  }
}

export function downFile(fileStr: string, fileType: string) {
  const anchorEl = document.createElement('a')
  anchorEl.href = fileStr
  anchorEl.download = `${uuid()}.${fileType}`
  document.body.appendChild(anchorEl) // required for firefox
  anchorEl.click()
  anchorEl.remove()
}

export default {
  getImgStr,
  downFile,
  selectFiles,
  insertImgFile,
  clipboardText
}
