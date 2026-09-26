import request from '@/config/axios'

const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'

/**
 * 数字人视频保存
 */
export const saveVideo = async (data) => {
  return await request.post({ url: `${prefix}/aiDhHumanVideo/save`, data, timeout: 0 })
}

export const saveLiveVideo = async (data) => {
  return await request.post({ url: `${prefix}/liveStream/putLiveStream`, data, timeout: 0 })
}

export const saveTrainVideo = async (data) => {
  return await request.post({ url: `${prefix}/TrainStream/putTrainStream`, data, timeout: 0 })
}

/**
 * 数字人视频删除
 */
export const deleteVideo = (data) => {
  return request.post({ url: `${prefix}/aiDhHumanVideo/delete`, data })
}

/**
 * 重命名视频
 */
export const renameVideo = (data) => {
  return request.post({ url: `${prefix}/aiDhHumanVideo/update`, data })
}

/**
 * 获取视频IO
 */
export const getVideoIO = (params) => {
  return request.get({ url: `${prefix}/aiDhHumanVideo/getOneVideoIO`, params, timeout: 0 })
}

/**
 * 查询单个视频
 */
export const getVideoDetail = async (data) => {
  return await request.post({ url: `${prefix}/aiDhHumanVideo/getVideoOne`, data })
}


export const getVideoById = async (data) => {
  return await request.post({ url: `${prefix}/aiDhHumanVideo/getVideoById`, data })
}

/**
 * 文案管理
 * @param data 请求参数 "publicLibType": "0",  //是否公共库 1：是，0：否' "oprStaff": "test"     //用户id
 *
 */
export const getTextManageListPage = (data) => {
  return request.post({ url: `${prefix}/copyWritManage/page`, data })
}

/**
 * 文案编辑
 *  "id": "11111",     //文案 id
    "oprStaff":"test", // 登录用户id
    "copywriteContent":"修改文案内容文案内容文案内容文案内容文案内容修改文案内容文案内容文案内容文案内容文案内容",   //文案内容
    "copywriteTitle":"文案标题修改"       //文案标题
 */
export const getTextManageDetailEdit = async (data) => {
  return await request.post({ url: `${prefix}/copyWritManage/update`, data })
}

/**
 * 文案详情
 * id 文案id
 */
export const getTextManageDetail = async (data) => {
  return await request.post({ url: `${prefix}/copyWritManage/getOne`, data })
}

/**
 * 文案删除
 * id
 */
export const deleteTextManage = (data) => {
  return request.post({ url: `${prefix}/copyWritManage/delete`, data })
}

/**
 * getPPT
 *
 */
export const getTextPPT = async (data) => {
  return await request.post({ url: `${prefix}/copyWritManage/pagePPT`, data })
}

/**
 * getPPTModel
 */
export const getTextPPTModel = async () => {
  return await request.post({ url: `${prefix}/aiDhPpt/getppt` })
}

/**
 * deletePPT
 */
export const deleteTextPPT = (data) => {
  return request.post({ url: `${prefix}/copyWritManage/deletePPT`, data })
}
/**
 * upload PPT
 */
export const uploadPPT = (formData) => {
  return request.upload({ url: `${prefix}/copyWritManage/uploadPPT`, data: formData })
}

/**
 * download PPT
 */
export const downloadPPT = (data) => {
  return request.download2({ url: `${prefix}/copyWritManage/downloadPPT`, data })
}

/**
 * 大纲生成接口
 */
export const createOutline = async (data) => {
  return await request.post({ url: `${prefix}/aiDhPpt/generate_outline`, data, timeout: 0 })
}

/**
 * 生成课件/文本
 */
export const createPPTAndTextBoy = async (data) => {
  return await request.post({ url: `${prefix}/aiDhPpt/generate_body`, data, timeout: 0 })
}

/**
 * 生成PPT
 */
export const createPPT = async (data) => {
  return await request.post({ url: `${prefix}/aiDhPpt/generate_ppt`, data, timeout: 0 })
}

/**
 * 获取Agent
 */
export const getAgentList = async () => {
  return await request.post({ url: `${prefix}/aiAgent/agentList` })
}

/**
 * 获取视频列表
 */
export const getVideoList = (data) => {
  return request.post({ url: `${prefix}/aiDhHumanVideo/page`, data })
}

/**
 * getFirstPptImageByCopywriteId
 * @param copywriteId
 */
export const getFirstPptImageByCopywriteId = async (data) => {
  return await request.post({ url: `${prefix}/aiDhHumanVideo/getFirstPptImageByCopywriteId`, data })
}

/**
 * 获取PTT缩略图列表
 * @param data：{
 *  pptId: 1
 * }
 */
export const getPPTThumbnailList = async (data) => {
  return await request.post({ url: `${prefix}/aiPptRecordDetail/getPptRecordDetail`, data })
}

/**
 * 保存缩略图描述
 * @param data: {
 *  pptNum: 1,
 *  pptId: 1,
 *  pptImageWords: '描述'
 * }
 */
export const saveThumbnailDesc = async (data) => {
  return await request.post({ url: `${prefix}/aiPptRecordDetail/updatePptRecordDetail`, data })
}

/**
 * 上传背景
 */
export const uploadBackground = async (formData, config) => {
  return await request.upload({
    url: `${prefix}/videoBackground/backgroundUpload`,
    data: formData,
    ...config
  })
}

/**
 * 获取背景列表
 */
export const getBackgroundList = async (data) => {
  return await request.post({ url: `${prefix}/videoBackground/backgroundQuery`, data })
}

/**
 * 删除背景
 */
export const deleteBackground = async (data) => {
  return await request.post({ url: `${prefix}/videoBackground/backgroundDel`, data })
}

/**
 * 上传素材
 */
export const uploadMaterial = async (formData, config) => {
  return await request.upload({
    url: `${prefix}/videoBackground/materialUpload`,
    data: formData,
    ...config
  })
}

/**
 * 获取素材列表
 * "pageNum": 1,
    "pageSize": 10,
    "materialName": "2407091458_20240913113826",  //素材名称
    "bgShare": "0",  //是否公共库   0不是
    "materialType": "1"  //素材类型 1图片  2视频
 */
export const getMaterialList = async (data) => {
  return await request.post({ url: `${prefix}/videoBackground/materialQuery`, data })
}

/**
 * 删除素材
 * id
 */
export const deleteMaterial = async (data) => {
  return await request.post({ url: `${prefix}/videoBackground/materialDel`, data })
}

/**
 * 下载 视频
 *
 */
export const downloadVideo = async (url) => {
  return await request.download({ url: url })
}

/**
 * 生成声音
 */
export const createVoiceApi = async (data) => {
  return await request.post({ url: `${prefix}/voiceManager/callVoiceClone`, data, timeout: 0 })
}

/**
 * 上传文件
 */
export const uploadFile = async (formData) => {
  return request.upload({ url: `${prefix}/aiDhPpt/uploadFile`, data: formData })
}
