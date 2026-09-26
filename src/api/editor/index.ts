import request from '@/config/axios'

const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'

/**
 * 获取海报字体列表
 */
export const getFontList = async () => {
  return await request.post({ url: `${prefix}/aosterDesign/getFontTemplate`, data: {}, timeout: 0 })
}

/**
 * 获取海报模板列表
 */
export const getTemplateList = async (data: any) => {
  return await request.post({ url: `${prefix}/aosterDesign/getAosterDesignList`, data: data })
}

/**
 * 保存海报模板
 */
export const saveTemplate = async (data: any) => {
  return await request.post({ url: `${prefix}/aosterDesign/insertAosterDesign`, data: data })
}

/**
 * 修改海报模板
 */
export const updateTemplate = async (data: any) => {
  return await request.post({ url: `${prefix}/aosterDesign/updateAosterDesignList`, data: data })
}

/**
 * 删除海报模板
 * {
 * "id": "1"
 * }
 */
export const deleteTemplate = async (data: any) => {
  return await request.post({ url: `${prefix}/aosterDesign/deleteAosterDesignList`, data: data })
}
