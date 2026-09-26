import request from '@/config/axios'

// 数字人课程管理 VO
export interface AiTrainMainVO {
  id: string // 视频id
  trainId: string // 同视频id
  trainName: string // 视频名称
  trainType: string // 视频分类
  systemType: string // 系统归属
  liveCover: string // 视频封面
  liveDesc: string // 视频简介
  createType: string // 创建类型
  copywriteId: string // 上传文件对应文案ID
  videoId: string // 内容制作ID
  videoUrl: string // 上传视频url地址
  watchState: string // 上下架状态
  state: string // 课程状态
  videoDuration: number // 视频时长（单位：秒）
  remark: string // 备注说明
  phoneFIle: File // 新增封面文件字段
  videoFIle: File // 新增视频文件字段
  eparchyCode: string
}
const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'
// 数字人课程管理 API
export const AiTrainMainApi = {
  // 查询数字人课程管理分页
  getAiTrainMainPage: async (params: any) => {
    return await request.get({ url: `${prefix}/ai-train-main/page`, params })
  },

  // 查询数字人课程管理详情
  getAiTrainMain: async (id: number) => {
    return await request.get({ url: `${prefix}/ai-train-main/get?id=` + id })
  },
  // 查询数字人课程管理-查询id最大值
  getmaxid: async () => {
    return await request.post({ url: `${prefix}/ai-train-main/getmaxid`})
  },
  // 新增数字人课程管理
  createAiTrainMain: async (data: AiTrainMainVO) => {
    return await request.post({ url: `${prefix}/ai-train-main/create`, data })
  },
  // 新增数字人课程管理-上传
  createuploadAiTrainMain: async (data: AiTrainMainVO) => {
    return await request.post({ url: `${prefix}/ai-train-main/createupload`, data })
  },

  // 修改数字人课程管理
  updateAiTrainMain: async (data: AiTrainMainVO) => {
    return await request.put({ url: `${prefix}/ai-train-main/update`, data })
    //return await request.post({ url: `${prefix}/TrainStream/uptTrainStream`, data , headersType: 'multipart/form-data'})
  },

  // 删除数字人课程管理
  deleteAiTrainMain: async (id: number) => {
    return await request.delete({ url: `${prefix}/ai-train-main/delete?id=` + id })
  },

  // 导出数字人课程管理 Excel
  exportAiTrainMain: async (params) => {
    return await request.download({ url: `${prefix}/ai-train-main/export-excel`, params })
  },
  uploadLiveCover: async (formData, config) => {
    return await request.upload({
      url: `${prefix}/ai-train-main/liveCoverUpload`,
      data: formData,
      ...config
    })
  },
  uploadvideo: async (formData, config) => {
    return await request.upload({
      url: `${prefix}/ai-train-main/videoUpload`,
      data: formData,
      ...config
    })
  },

  addAiTrainMain: async (data: AiTrainMainVO) => {
    return await request.post({url: `${prefix}/TrainStream/addTrainStreamnew`, data: data})
  },
  // 视频课程基本信息保存
  baseinfoAiTrainMain: async (data: AiTrainMainVO) => {
    return await request.post({ url: `${prefix}/TrainStream/addTrainStream`, data, headersType: 'multipart/form-data'})
  },
  // 视频课程上传:填写基本信息并上传封面和视频
  uploadvideoAiTrainMain: async (data: AiTrainMainVO) => {
    return await request.post({ url: `${prefix}/TrainStream/upLoadTrainStream`, data, headersType: 'multipart/form-data'})
  },
  // 数字人课程管理-基本信息回显
  getbaseinfo: async (id: number) => {
    debugger
    console.log("getbaseinfo()---------------------------------------->id:"+id)
    //return await request.post({ url: `${prefix}/TrainStream/checkTrainStream?trainId=`+ id})
    return await request.post({
      url: `${prefix}/TrainStream/checkTrainStream`,
      data: { trainId: id }, // 将 id 作为 JSON 对象的一部分发送
      headers: {
        'Content-Type': 'application/json' // 设置请求头为 application/json
      }
    })
  }
}
