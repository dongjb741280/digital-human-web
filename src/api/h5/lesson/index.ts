import request from '@/config/axios'
import axios from "axios";
import {getAccessToken} from "@/utils/auth";


const prefix = import.meta.env.VITE_BASE_URL+'/digital-api/app'

export const getNotLearnedCount = async (params) => {
  return await request.get({url: `${prefix}/ai-train-main/get-not-learned-count`, params, timeout: 0})
}

export const getApplist = async (params) => {
  return await request.get({url: `${prefix}/ai-train-main/get-app-list`, params, timeout: 0 })
}


