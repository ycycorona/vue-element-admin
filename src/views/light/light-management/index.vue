<template>
  <div class="app-container">
    <split-pane split="vertical" :default-percent="15">
      <template slot="paneL">
        <div class="left-container">
          <pro-gro-single-sel
            :tree-data="projectGroupLightData"
            @node-select-change="nodeSelectChange"
          />
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <div class="filter-container form-filter">
            <el-form :inline="true" :model="form" size="small" class="form">
              <el-button type="primary" size="small">刷新</el-button>
              <el-button type="primary" size="small">删除</el-button>
              <el-dropdown @command="lightManCommandClick">
                <el-button type="primary" size="small">
                  更多菜单<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="popOClight">开关灯模式</el-dropdown-item>
                  <el-dropdown-item command="qiangzhigonglv_group">强制开关灯功率</el-dropdown-item>
                  <el-dropdown-item command="popUpdateModel">调光策略设置</el-dropdown-item>
                  <el-dropdown-item command="popUpdateTime">编组时间校准</el-dropdown-item>
                  <el-dropdown-item command="jiaobiao_group">编组校表</el-dropdown-item>
                  <el-dropdown-item command="jwd_group">编组经纬度校准</el-dropdown-item>
                  <el-dropdown-item command="panid_group">编组PANID修改</el-dropdown-item>
                  <el-dropdown-item command="pindao_group">编组频道修改</el-dropdown-item>
                  <el-dropdown-item command="setthresholdWindow_group">编组报警阈设置</el-dropdown-item>
                  <el-dropdown-item command="settriggerWindow_group">红外触发参数设置</el-dropdown-item>
                  <el-dropdown-item command="lightDetail_group">编组更新路灯状态</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-form-item label="">
                <el-select v-model="form.orderType" size="small">
                  <el-option
                    v-for="item in OrderTypesOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.name" placeholder="按路灯编号查询" />
              </el-form-item>
              <el-form-item class="explain-img-wrap">
                <img :src="imgs.lightGb" height="24px">关闭&nbsp;
                <img :src="imgs.lightGz" height="24px">故障&nbsp;
                <img :src="imgs.lightDengdai" height="24px">待读&nbsp;
                <img :src="imgs.lightKd" height="24px">开灯&nbsp;
                <img :src="imgs.lightGd" height="24px">关灯&nbsp;
                <img :src="imgs.gatewayOnline" height="24px">在线&nbsp;
                <img :src="imgs.gatewayOutline" height="24px">离线&nbsp;
              </el-form-item>
            </el-form>
          </div>

          <div class="table-container">
            <template v-if="selectedType==='pro'">
              <el-table
                :data="tableData"
                border
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column
                  v-for="(tableCol, index) in tableThMapPro"
                  :key="index"
                  :prop="tableCol.prop"
                  :min-width="tableCol.width"
                  :label="tableCol.label"
                >
                  <template slot-scope="{row}">
                    <template>{{ row[tableCol.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-if="selectedType==='gro'">
              <el-table
                :data="tableData"
                border
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column
                  v-for="(tableCol, index) in tableThMapGro"
                  :key="index"
                  :prop="tableCol.prop"
                  :min-width="tableCol.width"
                  :label="tableCol.label"
                >
                  <template slot-scope="{row}">
                    <template>{{ row[tableCol.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import lightGb from '@/assets/light/imgs/light-management/light-gb.png'
import lightGz from '@/assets/light/imgs/light-management/light-gz.png'
import lightDengdai from '@/assets/light/imgs/light-management/light-dengdai.png'
import lightKd from '@/assets/light/imgs/light-management/light-kd.png'
import lightGd from '@/assets/light/imgs/light-management/light-gd.png'
import gatewayOnline from '@/assets/light/imgs/light-management/gateway-online.png'
import gatewayOutline from '@/assets/light/imgs/light-management/gateway-outline.png'

const imgs = {
  lightGb, lightGz, lightDengdai, lightKd, lightGd, gatewayOnline, gatewayOutline
}

// import { deepClone } from '@/utils'
import splitPane from 'vue-splitpane'
import { getProjectGrouplight } from '@/api/light/common'
import { lightManagementGroupsInfoList, lightManagementInfoList } from '@/api/light/light-management'
import ProGroSingleSel from './components/ProGroSingleSel'
import tableCellWidthMap from '@/config/tableCellWidthMap'

const tableThMapGro = [
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
    width: tableCellWidthMap.d
  },
  {
    prop: 'paixu',
    label: '排序等级',
    width: tableCellWidthMap.d
  },
  {
    prop: 'getDetail',
    label: '操作',
    width: tableCellWidthMap.d
  }
]

const tableThMapPro = [
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

const OrderTypesOpt = [
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
export default {
  name: 'LightManagement',

  components: {
    ProGroSingleSel, splitPane
  },
  data() {
    return {
      tableThMapPro: tableThMapPro,
      tableThMapGro: tableThMapGro,
      imgs,
      projectGroupLightData: [],
      form: {
        orderType: 1,
        name: ''
      },
      OrderTypesOpt: OrderTypesOpt,
      selectedId: '',
      selectedType: '',
      currentPage: 1,
      limit: 20,
      tableData: null
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.doGetProjectGroupLight()
  },
  methods: {
    // 获取选择器数据
    doGetProjectGroupLight() {
      return new Promise((resolve, reject) => {
        getProjectGrouplight()
          .then(response => {
            this.projectGroupLightData = response
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 项目、编组单选器的回调
    nodeSelectChange(selectedId, selectedType) {
      console.log(selectedId, selectedType)
      this.selectedId = selectedId
      this.selectedType = selectedType

      if (selectedType === 'pro') {
        this.doLightManagementGroupsInfoList()
      } else if (selectedType === 'gro') {
        this.doLightManagementInfoList()
      } else if (selectedType === 'notApproved') {
        //
      }
    },
    // 获取项目下的分组信息
    doLightManagementGroupsInfoList() {
      lightManagementGroupsInfoList({
        projectId: this.selectedId,
        currentPage: this.currentPage,
        limit: this.limit,
        name: ''

      })
        .then(response => {
          this.tableData = response.projectInfo
          // console.log(response.projectInfo)
        })
    },
    // 获取分组下的路灯信息
    doLightManagementInfoList() {
      lightManagementInfoList({
        groupId: this.selectedId,
        currentPage: this.currentPage,
        limit: this.limit,
        name: '',
        sortType: 1

      })
        .then(response => {
          this.tableData = response.projectInfo
          // console.log(response.projectInfo)
        })
    },
    // 路灯操作选择器回调
    lightManCommandClick(command) {
      console.log(command)
    }
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>
.form {
  position: relative
}
.left-container {
  /* background-color: #f38181; */
  height: 100%;
  overflow: auto;
}

.right-container {
  /* background-color: #fce38a; */
  height: 100%;
  overflow: auto;
}
.form-filter {
  padding-left: 20px;
}
.explain-img-wrap img {
  vertical-align: middle
}
</style>
