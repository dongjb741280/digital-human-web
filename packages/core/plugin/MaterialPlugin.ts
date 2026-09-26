/*
 * 素材插件
 */

import { fabric } from 'fabric'
import Editor from '../Editor'
type IEditor = Editor

class MaterialPlugin {
  public canvas: fabric.Canvas
  public editor: IEditor
  static pluginName = 'MaterialPlugin'
  static apis = ['getMaterialType', 'saveTemplate', 'saveTempData', 'getTempData']
  requstApi: any
  tempData = {}
  constructor(
    canvas: fabric.Canvas,
    editor: IEditor,
    config: {
      template: () => Promise<any[]>
      saveTemplate: (option: any) => Promise<any>
      uploadImage: (file: File) => Promise<string>
    }
  ) {
    this.canvas = canvas
    this.editor = editor
    this.requstApi = config
  }

  // 根据素材类型获取分裂列表
  async getMaterialType(typeId: string) {
    if (!this.requstApi[typeId]) return Promise.resolve([])

    return this.requstApi[typeId]()
  }
  saveTempData(item: any) {
    this.tempData = item
  }

  getTempData() {
    return this.tempData
  }
  // 保存模板
  async saveTemplate() {
    const json = await this.getJson()
    const file = await this.getImageFile()
    if (!file) return Promise.reject('未获取到图片')
    if (!this.requstApi.saveTemplate) return Promise.reject('未配置保存模板接口')
    if (!this.requstApi.uploadImage) return Promise.reject('未配置上传图片接口')
    const dataUrl = await this.requstApi.uploadImage(file)
    return this.requstApi.saveTemplate({ json, dataUrl, ...this.tempData })
  }

  getImageFile() {
    return new Promise((resolve) => {
      this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
        const option = this._getSaveOption()
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
        const dataUrl = this.canvas.toDataURL(option)
        this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
          // fileReader to file
          this._dataURLtoBlob(dataUrl).then((blob) => {
            const fileName = 'design_template.png'
            const file = new File([blob], fileName, { type: 'image/png' })
            resolve(file)
          })
        })
      })
    })
  }

  _dataURLtoBlob(dataUrl: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const arr = dataUrl.split(',')
      const mime = arr[0].match(/:(.*?);/)?.[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      resolve(new Blob([u8arr], { type: mime }))
    })
  }

  _getSaveOption() {
    const workspace = this.canvas
      .getObjects()
      .find((item: fabric.Object) => item.id === 'workspace')
    const { left, top, width, height } = workspace as fabric.Object
    const option = {
      name: 'New Image',
      format: 'png',
      quality: 1,
      width,
      height,
      left,
      top
    }
    return option
  }

  transformText(objects: any) {
    if (!objects) return
    objects.forEach((item: any) => {
      if (item.objects) {
        this.transformText(item.objects)
      } else {
        item.type === 'text' && (item.type = 'textbox')
      }
    })
  }

  async getJson() {
    const dataUrl = this.canvas.toJSON([
      'id',
      'gradientAngle',
      'selectable',
      'hasControls',
      'linkData'
    ])
    await this.transformText(dataUrl.objects)
    return JSON.stringify(dataUrl, null, '\t')
  }
}

export default MaterialPlugin
