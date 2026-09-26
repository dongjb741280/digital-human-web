import request from '@/config/axios'

// 数字人直播管理主 VO
export interface AiLiveMainVO {
  id: string // 主键ID
  liveName: string // 直播名称
  liveTime: string // 直播时间
  liveType: string // 直播分类
  systemType: string // 系统归属
  liveCover: string // 直播封面
  liveDesc: string // 直播简介
  copywriteId: string // 上传PPT对应文案ID
  watchState: string // 观看状态
  videoId: string
  videoStatus: string
  eparchyCode: string
}

const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'

// 数字人直播管理主 API
export const AiLiveMainApi = {
  // 查询数字人直播管理主分页
  getAiLiveMainPage: async (params: any) => {
    return await request.get({ url: `${prefix}/ai-live-main/page`, params })
  },

  // 查询数字人直播管理主详情
  getAiLiveMain: async (id: number) => {
    return await request.get({ url: `${prefix}/ai-live-main/get?id=` + id })
  },

  // 新增数字人直播管理主
  createAiLiveMain: async (formData) => {
    return await request.upload({ url: `${prefix}/liveStream/addLiveStream`, data: formData  })
  },


  // 修改数字人直播管理主
  updateAiLiveMain: async (data: AiLiveMainVO) => {
    return await request.put({ url: `${prefix}/ai-live-main/update`, data })
  },

  // 删除数字人直播管理主
  deleteAiLiveMain: async (id: number) => {
    return await request.delete({ url: `${prefix}/ai-live-main/delete?id=` + id })
  },

  // 导出数字人直播管理主 Excel
  exportAiLiveMain: async (params) => {
    return await request.download({ url: `${prefix}/ai-live-main/export-excel`, params })
  },

  uploadLiveCover: async (formData, config) => {
    return await request.upload({
      url: `${prefix}/ai-live-main/liveCoverUpload`,
      data: formData,
      ...config
    })
  }
}