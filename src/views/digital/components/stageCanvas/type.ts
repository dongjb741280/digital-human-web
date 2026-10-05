export type Layer = {
  id: string
  name: layerType
  type: string
  src: string
  title?: string
  delete?: boolean
  x?: number
  y?: number
  scaleWidth?: number
  width?: number
  scaleHeight?: number
  height?: number
  zIndex?: number
  opacity?: number
  visible?: boolean
}

export type layerType =
  | 'Human'
  | 'PPT'
  | 'Image'
  | 'BackGround'
  | 'Text'
  | 'Video'
  | `Image-${number}`
  | `Video-${number}`

export type StageViewHtml = HTMLDivElement & {
  setZIndex: (obj: { type: string; zIndex: number }) => void
  getLayersData: () => any[]
  onItemFocus: (layer: Layer) => void
  onItemDelete: (layer: Layer) => void
  setOpacity: (layer: Layer, opacity: number) => void
  playVideo: (layer: Layer) => void
  stopVideo: () => void
  addLayer: (layer: Layer) => void
  updateLayer: (layer: Layer) => void
  setLayers: (layers: Layer[]) => void
  setBackground: (layer: Layer) => void
}
