import request from '@/utils/request'

// 获取路灯信息列表
export function lightManagementInfoList({ groupId, currentPage, limit, name }) {
  return request({
    url: `/api/lightManagement/filterLightInfo/${name || null}${groupId}/${currentPage}/  `,
    method: 'get'
  })
}

// 获取某个项目下的分组信息
export function lightManagementGroupsInfoList({ projectId, currentPage, limit, name, sortType }) {
  return request({
    url: `/api/lightManagement/filterProjectInfo/${projectId}/${currentPage}/${limit}/${sortType}`,
    method: 'post',
    data: {
      name: name
    }
  })
}
