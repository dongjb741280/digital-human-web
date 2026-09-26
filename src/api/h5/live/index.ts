import request from '@/config/axios'
import axios from "axios";
import {getAccessToken} from "@/utils/auth";





const prefixApp = import.meta.env.VITE_BASE_URL+'/digital-api/app'
const prefix = import.meta.env.VITE_BASE_URL + '/digital-api/system'



export const getTrainStream = async (params) => {
  return await request.post({url: `${prefix}/TrainStream/getTrainStream`, data: params, timeout: 0 })
}

export const getAppLiveStream = async (params) => {
  return await request.post({url: `${prefix}/liveStream/appLiveStream`, data: params, timeout: 0 })
}

export const getRecent = async () => {
  return await request.get({url: `${prefixApp}/ai-live-main/get-recent`})
}

export const getPage = async (params) => {
  return await request.get({url: `${prefixApp}/ai-live-main/page`, params, timeout: 0 })
}


