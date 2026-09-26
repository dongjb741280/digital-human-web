import request from '@/config/axios'
import axios from "axios";
import {getAccessToken} from "@/utils/auth";

// AI 聊天对话 VO
export interface DigitalPersonVO {
  id: string;
  humanName?: string;
  fileName: string;
  file?: File;
  humanImageUrl: string;
  humanViedoUrl: string;
  humanShare: string;
  humanBg: string;
  humanOrgUrl: string;
  humanGenerateUrl: string;
  humanStatus?: string;
}

export interface DigitalPersonReqVO {
  queryType?: string;

}

// 新增一个接口，专门用于文件上传
interface VideoUploadResp {
  code: number;
  msg: string;
  data: object;
}

const prefix = import.meta.env.VITE_BASE_URL+'/digital-api/system'
export const getAiDhHumanPage = async (data: DigitalPersonReqVO) => {
  return await request.post({url: `${prefix}/aiDhHuman/page`, data})
}

export const getOne = async (id: string) => {
  return await request.post({url: `${prefix}/aiDhHuman/getOne?id=` + id})
}

export const create = async (data: any) => {
  return await request.post({url: `${prefix}/aiDhHuman/create`, data})
}

export const update = async (data: any) => {
  return await request.post({url: `${prefix}/aiDhHuman/update`, data})
}

// 删除音乐
export const deleteDigitalPerson = async (id: number) => {
  return await request.get({url: `${prefix}/aiDhHuman/delete?id=` + id})
}

export const getAgentList = async (agentType: string) => {
  return await request.post({url: `${prefix}/aiAgent/getAgentList?agentType=` + agentType})
}

export const getLanguagePracticeInfo = async (data: any) => {
  return await request.post({url: `${prefix}/aiAgent/getLanguagePracticeInfo`, data})
}

export const videoUpload = async (file: File, aiDhHumanSaveVO: DigitalPersonVO): Promise<DigitalPersonVO> => {
  const formData = new FormData();
  // 将对象转换为JSON字符串
  const jsonStr = JSON.stringify(aiDhHumanSaveVO);
  formData.append('data', jsonStr); // 假设后端能识别'data'字段
  // 添加文件
  formData.append('file', file.raw, file.name); // 假设后端能识别'file'字段
  try {
    const response = await axios.post(`${prefix}/aiDhHuman/uploadViedo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 后端需要能处理这种混合内容类型
        Authorization: 'Bearer ' + getAccessToken(),
      },
    });
    console.log('Voice file upload response:', response);
    return response.data as VideoUploadResp;
  } catch (error) {
    console.error('Voice file upload failed:', error);
    throw error;
  }
};
