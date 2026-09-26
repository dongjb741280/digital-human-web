import request from '@/config/axios'

// 数字人直播观看记录 VO
export interface AiLiveWatchHistoryVO {
  id: number // 主键ID
  liveId: string // 直播主键ID
  staffId: string // 用户工号
  viewType: number // 观看类型：1 直播，2 回看
  viewDuration: number // 观看时长（单位：秒）
  remark: string // 备注说明
  reserve1: string // 预留字段1
  reserve2: string // 预留字段2
  reserve3: string // 预留字段3
  reserve4: string // 预留字段4
  reserve5: string // 预留字段5
  deptName: string // 部门名称
  staffName: string // 用户姓名
}

const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'

// 数字人直播观看记录 API
export const AiLiveWatchHistoryApi = {
  // 查询数字人直播观看记录分页
  getAiLiveWatchHistoryPage: async (params: any) => {
    return await request.get({ url: `${prefix}/ai-live-watch-history/page`, params })
  },

  // 查询数字人直播观看记录详情
  getAiLiveWatchHistory: async (id: number) => {
    return await request.get({ url: `${prefix}/ai-live-watch-history/get?id=` + id })
  },

  // 新增数字人直播观看记录
  createAiLiveWatchHistory: async (data: AiLiveWatchHistoryVO) => {
    return await request.post({ url: `${prefix}/ai-live-watch-history/create`, data })
  },

  // 修改数字人直播观看记录
  updateAiLiveWatchHistory: async (data: AiLiveWatchHistoryVO) => {
    return await request.put({ url: `${prefix}/ai-live-watch-history/update`, data })
  },

  // 删除数字人直播观看记录
  deleteAiLiveWatchHistory: async (id: number) => {
    return await request.delete({ url: `${prefix}/ai-live-watch-history/delete?id=` + id })
  },

  // 导出数字人直播观看记录 Excel
  exportAiLiveWatchHistory: async (params) => {
    return await request.download({ url: `${prefix}/ai-live-watch-history/export-excel`, params })
  }
}