import Konva from 'konva'
export const useGuides = (stage: Konva.Stage, layer: Konva.Layer) => {
  const GUIDELINE_OFFSET = 5

  const getLineGuideStops = (skipShape) => {
    const vertical: any = [0, stage.width() / 2, stage.width()]
    const horizontal: any = [0, stage.height() / 2, stage.height()]

    stage.find('Image').forEach((guideItem) => {
      if (guideItem === skipShape) {
        return
      }
      const box = guideItem.getClientRect()
      vertical.push([box.x, box.x + box.width, box.x + box.width / 2])
      horizontal.push([box.y, box.y + box.height, box.y + box.height / 2])
    })
    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat()
    }
  }

  const getObjectSnappingEdges = (node) => {
    const box = node.getClientRect()
    const absPos = node.absolutePosition()

    return {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(absPos.x - box.x),
          snap: 'start'
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(absPos.x - box.x - box.width / 2),
          snap: 'center'
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(absPos.x - box.x - box.width),
          snap: 'end'
        }
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(absPos.y - box.y),
          snap: 'start'
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(absPos.y - box.y - box.height / 2),
          snap: 'center'
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(absPos.y - box.y - box.height),
          snap: 'end'
        }
      ]
    }
  }

  const getGuides = (lineGuideStops, itemBounds) => {
    const resultV: any[] = []
    const resultH: any[] = []

    lineGuideStops.vertical.forEach((lineGuide) => {
      itemBounds.vertical.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide)
        if (diff < GUIDELINE_OFFSET) {
          resultV.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset
          })
        }
      })
    })

    lineGuideStops.horizontal.forEach((lineGuide) => {
      itemBounds.horizontal.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide)
        if (diff < GUIDELINE_OFFSET) {
          resultH.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset
          })
        }
      })
    })

    const guides: any[] = []

    const minV = resultV.sort((a, b) => a.diff - b.diff)[0]
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0]
    if (minV) {
      guides.push({
        lineGuide: minV.lineGuide,
        offset: minV.offset,
        orientation: 'V',
        snap: minV.snap
      })
    }
    if (minH) {
      guides.push({
        lineGuide: minH.lineGuide,
        offset: minH.offset,
        orientation: 'H',
        snap: minH.snap
      })
    }
    return guides
  }

  const drawGuides = (guides) => {
    guides.forEach((lg) => {
      if (lg.orientation === 'H') {
        const line = new Konva.Line({
          points: [-6000, 0, 6000, 0],
          stroke: 'rgb(0, 161, 255)',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [4, 6]
        })
        layer.add(line)
        line.absolutePosition({
          x: 0,
          y: lg.lineGuide
        })
      } else if (lg.orientation === 'V') {
        const line = new Konva.Line({
          points: [0, -6000, 0, 6000],
          stroke: 'rgb(0, 161, 255)',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [4, 6]
        })
        layer.add(line)
        line.absolutePosition({
          x: lg.lineGuide,
          y: 0
        })
      }
    })
  }

  const init = () => {
    layer.on('dragmove', function (e) {
      layer.find('.guid-line').forEach((l) => l.destroy())

      const lineGuideStops = getLineGuideStops(e.target)
      const itemBounds = getObjectSnappingEdges(e.target)

      const guides = getGuides(lineGuideStops, itemBounds)

      if (!guides.length) {
        return
      }

      drawGuides(guides)

      const absPos = e.target.absolutePosition()

      guides.forEach((lg) => {
        switch (lg.orientation) {
          case 'V': {
            absPos.x = lg.lineGuide + lg.offset
            break
          }
          case 'H': {
            absPos.y = lg.lineGuide + lg.offset
            break
          }
        }
      })
      e.target.absolutePosition(absPos)
    })

    layer.on('dragend', function (e) {
      layer.find('.guid-line').forEach((l) => l.destroy())
    })
  }

  return {
    init
  }
}
