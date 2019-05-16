import request from '@/utils/request'

export function getOneP_GData(data) {
  return request({
    url: '/api/enegyAnalyse/getOneP_GData',
    method: 'post',
    data
  })
}

export function getMoreP_GData(data) {
  return request({
    url: '/api/enegyAnalyse/getMoreP_GData',
    method: 'post',
    data
  })
}
