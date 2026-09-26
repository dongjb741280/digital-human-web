/*
 * 自定义字体
 */

// const repoSrc = 'http://localhost:1337';
import { fabric } from 'fabric'
import FontFaceObserver from 'fontfaceobserver'
import Editor from '../Editor'
import { downFile } from '../utils/utils'

type IEditor = Editor

interface Font {
  type: string
  fontFamily: string
}

interface FontSource {
  name: string
  type: string
  file: string
  img: string
}

class FontPlugin {
  public canvas: fabric.Canvas
  public editor: IEditor
  static pluginName = 'FontPlugin'
  static apis = ['getFontList', 'loadFont']
  callBack: any
  cacheList: FontSource[]
  constructor(
    canvas: fabric.Canvas,
    editor: IEditor,
    config: { callBack: () => Promise<FontSource[]> }
  ) {
    this.canvas = canvas
    this.editor = editor
    this.callBack = config.callBack
    this.cacheList = []
  }

  hookImportBefore(json: string) {
    return this.downFontByJSON(json)
  }
  getFontList() {
    // 返回暂存字体
    if (this.cacheList.length > 0) {
      return Promise.resolve(this.cacheList)
    }
    if (!this.callBack) return Promise.resolve([])
    return this.callBack().then((res) => {
      const list = res.map((item: any) => {
        return {
          name: item.fontName,
          type: 'cn',
          file: item.fontPath,
          img: item.fontImg
        }
      })
      this.cacheList = list
      this.createFontCSS(list)
      return list
    })
  }

  downFontByJSON(str: string) {
    const fontFamilies: string[] = JSON.parse(str)
      .objects.filter((item: Font) => item.type.includes('text'))
      .map((item: Font) => item.fontFamily)

    console.log('downFontByJSON', fontFamilies)
    // 数组去重
    const fontArray = new Set(fontFamilies)
    // set to array
    console.log('fontFamilies', fontArray)
    if (fontArray.size === 0) {
      return Promise.resolve([])
    }
    const fontFamiliesAll = Array.from(fontArray).map((fontName) => {
      console.log('fontName', fontName)
      if (fontName === 'arial') {
        return Promise.resolve()
      }
      const font = new FontFaceObserver(fontName)
      return font.load(null, 150000)
    })
    return Promise.all(fontFamiliesAll)
  }

  // 获取字体数据 新增字体样式使用
  getFontJson() {
    const activeObject = this.canvas.getActiveObject()
    if (activeObject) {
      const json = activeObject.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls'])
      const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(json, null, '\t')
      )}`
      const dataUrl = activeObject.toDataURL()
      downFile(fileStr, 'font.json')
      downFile(dataUrl, 'font.png')
    }
  }

  loadFont(fontName: string) {
    const font = new FontFaceObserver(fontName)
    console.log('font', font, fontName)
    return font.load(null, 150000).then(() => {
      const activeObject = this.canvas.getActiveObjects()[0]
      if (activeObject) {
        activeObject.set('fontFamily', fontName)
        this.canvas.renderAll()
      }
    })
  }

  createFontCSS(arr: any[]) {
    let code = ''
    arr.forEach((item) => {
      code =
        code +
        `
    @font-face {
      font-family: ${item.name};
      src: url('${item.file}');
    }
    `
    })
    const style = document.createElement('style')
    try {
      style.appendChild(document.createTextNode(code))
    } catch (error) {
      // style.styleSheet.cssText = code;
    }
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
  }

  destroy() {
    console.log('pluginDestroy')
  }
}

export default FontPlugin
