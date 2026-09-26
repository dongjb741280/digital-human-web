import request from '@/config/axios'
import axios from 'axios';
import {getAccessToken} from "@/utils/auth";

// AI 聊天对话 VO
export interface VoiceVO {
  id: string;
  voiceName: string;
  voiceOrgUrl: string;
  voiceSex?: string;
  voiceLabel: string;
  voiceShare: string;
  voiceReferContent?: string;
  voiceSampleUrl?: string;
  voiceModelUrl?: string;
  voiceGptUrl?: string;
  voiceStatus?: string;
  oprTime?: string;
  oprStaff?: string;
}

export interface VoiceDelVO {
  id: string;
}

export interface VoicePageReqVO {
  voiceName?: string;
  voiceSex?: string;
  voiceLabel?: string;
  voiceShare?: string;
  voiceStatus?: string;
  pageNum: number;
  pageSize: number;
}

const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'
export const getVoicePage = async (data: VoicePageReqVO) => {
  return await request.post({url: `${prefix}/voiceManager/voiceList`, data})
}

export const voiceSave = async (data: VoiceVO) => {
  return await request.post({url: `${prefix}/voiceManager/voiceSave`, data: data})
}

export const voiceDel = async (data: VoiceDelVO) => {
  return await request.post({url: `${prefix}/voiceManager/voiceDel`, data: data})
}

export const voiceSample = async (data: VoiceDelVO) => {
  return await request.post({url: `${prefix}/voiceManager/voiceSample`, data: data})
}

/*export const voiceUpload = async (file: File) => {
  return await request.upload2({url: '${prefix}/voiceManager/voiceUpload', file: file})
}*/

// 新增一个接口，专门用于文件上传
interface VoiceUploadResp {
  code: number;
  msg: string;
  data: object;
}

// 文件上传函数
export const voiceUpload = async (file: File): Promise<VoiceUploadResp> => {
  const formData = new FormData();
  formData.append('file', file.raw, file.name); // 假设后端接收的文件字段名为'file'
  try {
    // 获取认证Token，这里假设你有一个全局函数或者从Vue的Pinia/Vuex store中获取
    //const authToken = getToken(); // 实现这个函数以获取当前用户的认证Token
    // 直接使用axios进行文件上传，因为它对文件上传支持更好
    const response = await axios.post(`${prefix}/voiceManager/voiceUpload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + getAccessToken(),
      },
    });
    console.log('Voice file upload response:', response)
    return response.data as VoiceUploadResp;
  } catch (error) {
    console.error('Voice file upload failed:', error);
    throw error;
  }
};
