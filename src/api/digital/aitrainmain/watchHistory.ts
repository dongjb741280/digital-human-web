import request from '@/config/axios'

// 数字人培训视频观看记录 VO
export interface AiTrainWatchHistoryVO {
  id: number // 主键ID
  trainId: string // 视频主键ID
  staffId: Date // 用户工号
  viewDuration: number // 观看时长（单位：秒）
  viewNum: number // 观看次数
  remark: string // 备注说明
  reserve1: string // 预留字段1
  reserve2: string // 预留字段2
  reserve3: string // 预留字段3
  reserve4: string // 预留字段4
  reserve5: string // 预留字段5
}
const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'
// 数字人培训视频观看记录 API
export const AiTrainWatchHistoryApi = {
  // 查询数字人培训视频观看记录分页
  getAiTrainWatchHistoryPage: async (params: any) => {
    return await request.get({ url: `${prefix}/ai-train-watch-history/page`, params })
  },

  // 查询数字人培训视频观看记录详情
  getAiTrainWatchHistory: async (id: number) => {
    return await request.get({ url: `${prefix}/ai-train-watch-history/get?id=` + id })
  },

  // 新增数字人培训视频观看记录
  createAiTrainWatchHistory: async (data: AiTrainWatchHistoryVO) => {
    return await request.post({ url: `${prefix}/ai-train-watch-history/create`, data })
  },

  // 修改数字人培训视频观看记录
  updateAiTrainWatchHistory: async (data: AiTrainWatchHistoryVO) => {
    return await request.put({ url: `/${prefix}/ai-train-watch-history/update`, data })
  },

  // 删除数字人培训视频观看记录
  deleteAiTrainWatchHistory: async (id: number) => {
    return await request.delete({ url: `${prefix}/ai-train-watch-history/delete?id=` + id })
  },

  // 导出数字人培训视频观看记录 Excel
  exportAiTrainWatchHistory: async (params) => {
    return await request.download({ url: `${prefix}/ai-train-watch-history/export-excel`, params })
  }
}
