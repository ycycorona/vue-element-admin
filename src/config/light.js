import tableCellWidthMap from './tableCellWidthMap'
export const TableThMapGro = [
  {
    prop: 'lightNumber',
    label: '智能灯编号',
    width: tableCellWidthMap.d
  },
  {
    prop: 'laststate1',
    label: 'I路状态',
    width: tableCellWidthMap.d
  },
  {
    prop: 'laststate2',
    label: 'II路状态',
    width: tableCellWidthMap.d
  },
  {
    prop: 'gatewayState',
    label: '网关状态',
    width: tableCellWidthMap.d
  },
  {
    prop: 'dimmingSignal_1',
    label: 'I路调光',
    width: tableCellWidthMap.d
  },
  {
    prop: 'dimmingSignal_2',
    label: 'II路调光',
    width: tableCellWidthMap.d
  },
  {
    prop: 'realtime_vol',
    label: '电压/V',
    width: tableCellWidthMap.d
  },
  {
    prop: 'realtime_current',
    label: '电流/A',
    width: tableCellWidthMap.d
  },
  {
    prop: 'frequency',
    label: '频率',
    width: tableCellWidthMap.d
  },
  {
    prop: 'powerFactor',
    label: '功率因数',
    width: tableCellWidthMap.d
  },
  {
    prop: 'power_kWh',
    label: '电量/kWh',
    width: tableCellWidthMap.d
  },
  {
    prop: 'createTime',
    label: '更新时间',
    width: tableCellWidthMap.h
  },
  {
    prop: 'paixu',
    label: '排序等级',
    width: tableCellWidthMap.f
  },
  {
    prop: 'getDetail',
    label: '操作',
    width: tableCellWidthMap.d
  }
]

export const TableThMapPro = [
  {
    prop: 'groupname',
    label: '编组名称',
    width: tableCellWidthMap.d
  },
  {
    prop: 'versioninfo',
    label: '版本信息',
    width: tableCellWidthMap.d
  },
  {
    prop: 'lightmodel',
    label: '智能灯模式',
    width: tableCellWidthMap.d
  },
  {
    prop: 'grouplocation',
    label: '编组地址',
    width: tableCellWidthMap.d
  },
  {
    prop: 'areacode',
    label: '区域码',
    width: tableCellWidthMap.d
  },
  {
    prop: 'banbenstring',
    label: '智能灯类型',
    width: tableCellWidthMap.d
  }]

export const TableThMapNotApproved = [
  {
    prop: 'createTime',
    label: '录入时间',
    width: tableCellWidthMap.d
  },
  {
    prop: 'createUser',
    label: '录入账号',
    width: tableCellWidthMap.d
  },
  {
    prop: 'projectName',
    label: '项目名称',
    width: tableCellWidthMap.d
  },
  {
    prop: 'gatewayName',
    label: '网关名称',
    width: tableCellWidthMap.f
  },
  {
    prop: 'groupName',
    label: '编组名称',
    width: tableCellWidthMap.f
  },
  {
    prop: 'lightSerielNum',
    label: '智能灯编号',
    width: tableCellWidthMap.c
  },
  {
    prop: 'banben',
    label: '智能灯版本',
    width: tableCellWidthMap.c
  },
  {
    prop: 'isApproved',
    label: '审核状态',
    width: tableCellWidthMap.c
  },
  {
    prop: 'getDetail',
    label: '获取详情',
    width: tableCellWidthMap.d
  }
]

export const OrderTypesOpt = [
  {
    label: '按排序等级排序',
    value: 1
  },
  {
    label: '按表格导入排序',
    value: 2
  },
  {
    label: '按智能灯编号顺序',
    value: 3
  },
  {
    label: '按智能灯编号倒序',
    value: 4
  }
]
