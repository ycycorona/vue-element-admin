import request from '@/utils/request'

// 获取智能灯信息列表
export function lightManagementInfoList({ groupId, currentPage, limit, name, sortType }) {
  return request({
    url: `/api/lightManagement/filterLightInfo/${name || null}/${groupId}/${currentPage}/${limit}/${sortType}`,
    method: 'get'
  })
}

// 获取某个项目下的分组信息
export function lightManagementGroupsInfoList({ projectId, currentPage, limit, name }) {
  return request({
    url: `/api/lightManagement/filterProjectInfo/${projectId}/${currentPage}/${limit}`,
    method: 'post',
    data: {
      name: name
    }
  })
}

// 获取智能灯详情
export function lightDetails(lightId) {
  return request({
    url: `/api/lightManagement/lightDetails/${lightId}`,
    method: 'get'
  })
}

// 更新智能灯排序
export function updateOrderPriority(lightId, groupId, newOrderPriority) {
  return request({
    url: `/api/lightManagement/updatepaixu/${lightId}/${groupId}/${newOrderPriority}`,
    method: 'get'
  })
}

// 根据groupId获取网关信息
export function getInfoFromGatewayId(groupId) {
  return request({
    url: `/api/lightManagement/getgatewayid/${groupId}`,
    method: 'get'
  })
}

// 获取智能灯类型
export function getLightType() {
  return request({
    url: `api/lightManagement/getLightType`,
    method: 'get'
  })
}

// 添加智能灯
export function addLight(addLightParams) {
  return request({
    url: `api/lightManagement/addLight`,
    method: 'post',
    data: addLightParams
  })
}

// 获取未通过审核的智能灯列表
export function lightManagement({ groupName, projectName, approved, currentPage, limit }) {
  // debugger
  return request({
    url: `/api/lightManagement/list/${currentPage}/${limit}`,
    method: 'post',
    data: {
      approved: approved,
      filter1: projectName,
      filter2: groupName
    }
  })
}

// 获取未通过审核的智能灯详情
export function lightDetailsNP(lightId) {
  return request({
    url: `/api/lightManagement/lightDetailsNP/${lightId}`,
    method: 'get'
  })
}

// 更新未通过审核的智能灯信息
export function updateLight(editLightParams) {
  return request({
    url: `/api/lightManagement/updateLight`,
    method: 'post',
    data: editLightParams
  })
}

// 删除未通过审核的智能灯
export function realdeleteLight(lightId) {
  debugger
  return request({
    url: `/api/lightManagement/realdeleteLight`,
    method: 'post',
    data: {
      name: `${lightId}@`
    }
  })
}

