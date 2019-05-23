import tableCellWidthMap from './tableCellWidthMap'
export const TableThMapGro = [
  {
    prop: 'lightNumber',
    label: '路灯编号',
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
    label: '路灯模式',
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
    label: '路灯类型',
    width: tableCellWidthMap.d
  }]

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
    label: '按路灯编号顺序',
    value: 3
  },
  {
    label: '按路灯编号倒序',
    value: 4
  }
]
