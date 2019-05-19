import request from '@/utils/request'
import { proName } from './common'
// 获取单个项目图表数据
export function getOneP_GData(data) {
  return request({
    url: '/api/enegyAnalyse/getOneP_GData',
    method: 'post',
    data
  })
}

// 获取多个项目图表数据
export function getMoreP_GData(data) {
  return request({
    url: '/api/enegyAnalyse/getMoreP_GData',
    method: 'post',
    data
  })
}

// 导出excel数据 step1

export function getExcelPre(data) {
  return request({
    url: '/api/enegyAnalyse/excelLineData',
    method: 'post',
    data
  })
}

// 导出excel数据 step2
export const getExcelURL = `/${proName}/api/enegyAnalyse/excel1`
