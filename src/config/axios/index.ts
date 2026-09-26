import { service } from './service'

import { config } from './config'

const { default_headers } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType, onUploadProgress, ...config } = option
  return service({
    url: url,
    method,
    params,
    data,
    ...config,
    responseType: responseType,
    onUploadProgress: onUploadProgress,
    headers: {
      'Content-Type': headersType || default_headers
    }
  })
}
export default {
  get: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', ...option })
    return res.data as unknown as T
  },
  post: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res.data as unknown as T
  },
  postOriginal: async (option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res
  },
  delete: async <T = any>(option: any) => {
    const res = await request({ method: 'DELETE', ...option })
    return res.data as unknown as T
  },
  put: async <T = any>(option: any) => {
    const res = await request({ method: 'PUT', ...option })
    return res.data as unknown as T
  },
  download: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', responseType: 'blob', ...option })
    return res as unknown as Promise<T>
  },
  download2: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', responseType: 'blob', ...option })
    return res as unknown as Promise<T>
  },
  upload: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res as unknown as Promise<T>
  },

  upload2: async <T = any>(option: { url: string, file: File }) => {
    const formData = new FormData();
    formData.append('file', option.file.raw, option.file.name); // 假设后端接收的文件字段名为'file'

    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    const res = await request({
      method: 'POST',
      url: option.url,
      data: formData, // 使用formData作为data
      headers,
    });

    return res as unknown as Promise<T>;
  }
}
