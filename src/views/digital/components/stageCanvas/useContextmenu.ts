import Konva from 'konva'
import contextmenu from './contextmenu.vue'
import { createVNode, render } from 'vue'
export const useContextmenu = (stage: Konva.Stage, callback?: Function) => {
  let currentShape

  const MapFunc = {
    delete: () => {
      currentShape.destroy()
    },
    moveToTop: () => {
      currentShape.moveToTop()
    },
    moveToBottom: () => {
      currentShape.moveToBottom()
    },
    moveUp: () => {
      currentShape.moveUp()
    },
    moveDown: () => {
      currentShape.moveDown()
    }
  }
  const onMenuClick = (type: string) => {
    if (callback) {
      callback({ id: currentShape.id(), type })
    }
    MapFunc[type]?.()
    currentShape = null
    if (!menuNode.el) return
    menuNode.el.style.display = 'none'
  }
  const menuNode = createVNode(contextmenu, { onMenuClick })
  const container = stage.getContent()
  const init = () => {
    if (!container) return
    render(menuNode, container)
    stage.on('contextmenu', function (e) {
      e.evt.preventDefault()
      if (e.target === stage) {
        return
      }
      currentShape = e.target
      const containerRect = stage.container()
      const absolutePosition = currentShape.absolutePosition()
      if (!menuNode.el) return

      menuNode.el.style.display = 'initial'
      menuNode.el.style.transform = `translate(${containerRect.offsetLeft + absolutePosition.x}px, ${containerRect.offsetTop + absolutePosition.y - menuNode.el.offsetHeight - 10}px)`
    })
    window.addEventListener('click', () => {
      if (!menuNode.el) return
      menuNode.el.style.display = 'none'
    })
  }
  return {
    init
  }
}
