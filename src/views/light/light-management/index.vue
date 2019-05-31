<template>
  <div v-loading="commonLoading" class="full-height-app-container ">
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
            <!-- 筛选表单 -->
            <el-form :inline="true" :model="form" size="small" class="form">
              <el-form-item label="">
                <el-button type="primary" size="small" @click="getList">刷新</el-button>
              </el-form-item>
              <el-form-item v-if="selectedType==='notApproved'" label="">
                <el-button type="primary" size="small" @click="isShowAddLightDialog=true">添加</el-button>
              </el-form-item>
              <el-form-item v-if="selectedType==='notApproved'" label="">
                <el-button type="primary" size="small" @click="doOpenEditLightDialog">修改</el-button>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" size="small" @click="doDeleteLight">删除</el-button>
              </el-form-item>
              <el-form-item v-if="selectedType==='notApproved'" label="">
                <el-dropdown @command="unLightManCommandClick">
                  <el-button type="primary" size="small">
                    更多菜单<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="changeApproveState">更改审核状态</el-dropdown-item>
                    <el-dropdown-item command="addFromExcel">导入excel</el-dropdown-item>
                    <el-dropdown-item command="allapprove">全部审核</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
              <el-form-item v-else label="">
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
                    <el-dropdown-item command="lightDetail_group">编组更新智能灯状态</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
              <el-form-item v-if="selectedType==='gro'" label="">
                <el-select v-model="form.orderType" size="small" @change="onOrderTypeChange">
                  <el-option
                    v-for="item in OrderTypesOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item v-if="selectedType==='gro'">
                <el-input v-model="form.lightName" placeholder="按智能灯编号查询" style="width:50%" />
                <el-button type="primary" size="small" @click="lightNameSearch">搜索</el-button>
              </el-form-item>

              <el-form-item v-else-if="selectedType==='notApproved'">
                <el-input v-model="form.projectName" placeholder="按项目名称查询" style="width:35%" />
                <el-input v-model="form.groupName" placeholder="按编组名称查询" style="width:35%" />
                <el-button type="primary" size="small" @click="lightNameSearch">搜索</el-button>
              </el-form-item>

              <el-form-item v-else>
                <el-input v-model="form.groupName" placeholder="按编组名称查询" style="width:50%" />
                <el-button type="primary" size="small" @click="lightNameSearch">搜索</el-button>
              </el-form-item>

              <el-form-item v-if="selectedType==='gro'" class="explain-img-wrap">
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
            <!-- 选择未审核项目时的表格 -->
            <template v-if="selectedType==='notApproved'">
              <el-table
                v-loading="listLoading"
                :data="tableData"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  v-for="(tableCol, index) in tableThMapNotApproved"
                  :key="index"
                  :prop="tableCol.prop"
                  :min-width="tableCol.width"
                  :label="tableCol.label"
                >
                  <template slot-scope="{row}">
                    <template v-if="tableCol.prop==='getDetail'">
                      <div class="children-text-align">
                        <el-button type="primary" size="small" plain @click="showNotApprovedDetailDialog(row.id)">详情</el-button>
                      </div>
                    </template>
                    <template v-else>{{ row[tableCol.prop] | emptyToLine }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <!-- 选择项目时的表格 -->
            <template v-if="selectedType==='pro'">
              <el-table
                v-loading="listLoading"
                :data="tableData"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  v-for="(tableCol, index) in tableThMapPro"
                  :key="index"
                  :prop="tableCol.prop"
                  :min-width="tableCol.width"
                  :label="tableCol.label"
                >
                  <template slot-scope="{row}">
                    <template>{{ row[tableCol.prop] | emptyToLine }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <!-- 选择编组时的表格 -->
            <template v-if="selectedType==='gro'">
              <el-table
                v-loading="listLoading"
                :data="tableData"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  v-for="(tableCol, index) in tableThMapGro"
                  :key="index"
                  :prop="tableCol.prop"
                  :min-width="tableCol.width"
                  :label="tableCol.label"
                  :class-name="colClassName(tableCol.prop)"
                >
                  <template slot-scope="{row}">
                    <!-- 一路二智能灯光状态 -->
                    <template v-if="tableCol.prop==='laststate1' || tableCol.prop==='laststate2'">
                      <!--如果是空的就用  - 表示  -->
                      <template
                        v-if="row[tableCol.prop]===''"
                      >
                        {{ '' }}
                      </template>
                      <!--如果guanbi说明主路未安装  -->
                      <template
                        v-else-if="row[tableCol.prop]==='guanbi'"
                      >
                        <img :src="imgs.lightGb" class="cell-img">
                      </template>
                      <!--如果guzhang说明有故障  -->
                      <template
                        v-else-if="row[tableCol.prop]==='guzhang'"
                      >
                        <img :src="imgs.lightGz" class="cell-img">
                      </template>
                      <!--如果diaoxian表示控制器掉线就待读图示  -->
                      <template
                        v-else-if="row[tableCol.prop]==='diaoxian'"
                      >
                        <img :src="imgs.lightDengdai" class="cell-img">
                      </template>
                      <!-- 如果是1、3、4说明主路开灯 -->
                      <template
                        v-else-if="row[tableCol.prop]==='1'||
                          row[tableCol.prop]==='3'||
                          row[tableCol.prop]==='4'"
                      >
                        <img :src="imgs.lightKd" class="cell-img">
                      </template>
                      <!-- 如果是0、2说明主路关灯 -->
                      <template
                        v-else-if="row[tableCol.prop]==='0'||
                          row[tableCol.prop]==='2'"
                      >
                        <img :src="imgs.lightKd" class="cell-img">
                      </template>
                      <template v-else>
                        {{ row[tableCol.prop] }}
                      </template>
                    </template>
                    <!-- 网关状态 -->
                    <template v-else-if="tableCol.prop==='gatewayState'">
                      <template
                        v-if="row[tableCol.prop]===0"
                      >
                        <img :src="imgs.gatewayOnline" class="cell-img">
                      </template>
                      <template v-else>
                        <img :src="imgs.gatewayOutline" class="cell-img">
                      </template>
                    </template>
                    <!--1路调光  -->
                    <template v-else-if="tableCol.prop==='dimmingSignal_1' || tableCol.prop==='dimmingSignal_2'">
                      <template
                        v-if="row[tableCol.prop]"
                      >
                        {{ row[tableCol.prop] }}
                      </template>
                      <template v-else>
                        {{ '-' }}
                      </template>
                    </template>
                    <!-- 排序等级 -->
                    <template v-else-if="tableCol.prop==='paixu'">
                      <div style="width:50%;display:inline-block">
                        <el-input v-model="row[tableCol.prop]" size="mini" />
                      </div>

                      <el-button
                        type="primary"
                        size="mini"
                        plain
                        class="very-mini-btn"
                        @click="doUpdateOrderPriority(row.id, row.gid, row.paixu)"
                      >修改</el-button>
                      <!-- <template v-else>
                        {{ '-' }}
                      </template> -->
                    </template>
                    <!-- 查看详情 -->
                    <template v-else-if="tableCol.prop==='getDetail'">
                      <div class="children-text-align">
                        <el-button type="primary" size="small" plain @click="showDetailDialog(row.id)">详情</el-button>
                      </div>
                    </template>
                    <template v-else>{{ row[tableCol.prop] | emptyToLine }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
          <pagination v-show="count>0" :total="count" :page.sync="currentPage" :limit.sync="limit" @pagination="onPagination" />
        </div>
      </template>
    </split-pane>
    <!-- 智能灯详情弹窗 -->
    <el-dialog :visible.sync="isShowDetailDialog" title="智能灯详情" width="30%" style="min-width: 300px">
      <div class="detail-wrap">
        <template v-if="lightDetailData_1">
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">项目名称</span>
              <span>{{ lightDetailData_1.projectName }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">编组名称</span>
              <span>{{ lightDetailData_1.groupName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">智能灯编号</span>
              <span>{{ lightDetailData_1.lightNumber }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">外壳编号</span>
              <span>{{ lightDetailData_1.shellNumber }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">开关状态</span>
              <span>{{ lightDetailData_2.status | lightStatus }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">日能耗(kWh)</span>
              <span>{{ lightDetailData_2.power_kWh }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">实时电流(A)</span>
              <span>{{ lightDetailData_2.realtime_current }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">实时电压(V)</span>
              <span>{{ lightDetailData_2.realtime_vol }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">日出时间</span>
              <span>{{ lightDetailData_2.sun_rise }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">日落时间</span>
              <span>{{ lightDetailData_2.sun_set }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">1路调光信号</span>
              <span>{{ lightDetailData_2.dimmingSignal_1 }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">2路调光信号</span>
              <span>{{ lightDetailData_2.dimmingSignal_2 }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">1路点亮时间</span>
              <span>{{ lightDetailData_2.lightUpTime_1?lightDetailData_2.lightUpTime_1+'分钟':'' }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">2路点亮时间</span>
              <span>{{ lightDetailData_2.lightUpTime_2?lightDetailData_2.lightUpTime_2+'分钟':'' }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="li-label detail">功率因数</span>
              <span>{{ lightDetailData_2.powerFactor }}</span>
            </el-col>
            <el-col :span="12">
              <span class="li-label detail">频率值</span>
              <span>{{ lightDetailData_2.frequency }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="map-canvas-light-wrap">
                <light-location-map
                  :lng="lightDetailData_1.lng"
                  :lat="lightDetailData_1.lat"
                  @map-init-success="onMapInit"
                />
              </div>
            </el-col>
          </el-row>
        </template>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowDetailDialog = false">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加智能灯弹窗 -->
    <el-dialog
      :visible.sync="isShowAddLightDialog"
      title="添加智能灯"
      :close-on-click-modal="false"
      width="50%"
      style="min-width: 300px"
    >
      <add-light-pop ref="addLightDialogForm" :project-group-light-data="projectGroupLightData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doAddLight">保存</el-button>
        <el-button @click="isShowAddLightDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑未通过审核的智能灯 -->
    <el-dialog :visible.sync="isShowEditLightDialog" title="编辑智能灯" :close-on-click-modal="false" width="50%" style="min-width: 300px">
      <edit-light-pop
        v-if="isShowEditLightDialog"
        ref="editLightDialogForm"

        :detail-data="upLightDetailData"
        :project-group-light-data="projectGroupLightData"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doEditLight">保存</el-button>
        <el-button @click="isShowEditLightDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看未审核通过的智能灯 -->
    <el-dialog :visible.sync="isShowReadonlyNotApLightDialog" title="未通过审核智能灯" width="50%" style="min-width: 300px">
      <edit-light-pop
        v-if="isShowReadonlyNotApLightDialog"
        ref="readonlyLightDialogForm"
        :detail-data="upLightDetailData"
        :readonly="true"
        :project-group-light-data="projectGroupLightData"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowReadonlyNotApLightDialog = false">确定</el-button>
      </span>
    </el-dialog>
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
import LightLocationMap from './components/LightLocationMap'
import AddLightPop from './components/AddLightPop'
import EditLightPop from './components/EditLightPop'

const imgs = {
  lightGb, lightGz, lightDengdai, lightKd, lightGd, gatewayOnline, gatewayOutline
}

// import { deepClone } from '@/utils'
import splitPane from 'vue-splitpane'
import { getProjectGrouplight } from '@/api/light/common'
import { lightManagementGroupsInfoList, addLight, lightManagement,
  lightManagementInfoList, lightDetails, updateOrderPriority, lightDetailsNP,
  updateLight, realdeleteLight } from '@/api/light/light-management'
import ProGroSingleSel from './components/ProGroSingleSel'
import { TableThMapPro, TableThMapGro, TableThMapNotApproved, OrderTypesOpt } from '@/config/light'
import Pagination from '@/components/Pagination'

function resetFormFilter() {
  return {
    orderType: 1,
    lightName: '',
    groupName: '',
    projectName: ''
  }
}

export default {
  name: 'LightManagement',

  components: {
    ProGroSingleSel, splitPane, Pagination, LightLocationMap, AddLightPop,
    EditLightPop
  },
  filters: {
    lightStatus(string) {
      let res = ''
      switch (string) {
        case '0':
          res = '全关'
          break
        case '1':
          res = '主路开'
          break
        case '2':
          res = '辅路开'
          break
        case '3':
          res = '全开'
          break
        default:
          res = '未校时'
          break
      }
      return res
    }
  },
  data() {
    return {
      tableThMapPro: TableThMapPro,
      tableThMapGro: TableThMapGro,
      tableThMapNotApproved: TableThMapNotApproved,
      imgs,
      projectGroupLightData: [],
      form: resetFormFilter(),
      OrderTypesOpt: OrderTypesOpt,
      selectedId: '', // 当前选择器选中的id
      selectedType: '', // 当前的表格类型
      currentPage: 1,
      limit: 20,
      count: 0,
      tableData: null,
      checkedTableRows: [],
      listLoading: false, // 表格载入中
      commonLoading: false, // 组件内通用的loading
      dialogLoading: false, // 详情对话框载入中
      isShowDetailDialog: false,
      isShowAddLightDialog: false,
      isShowEditLightDialog: false,
      isShowReadonlyNotApLightDialog: false,
      lightDetailData_1: null,
      lightDetailData_2: null,
      upLightDetailData: null // 未通过审核路灯详情
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    await this.doGetProjectGroupLight()

    this.selectedType = 'notApproved'
    this.reset()
    this.getList()
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
      this.selectedId = selectedId
      this.selectedType = selectedType
      this.reset()
      this.getList()
    },
    // 重置表单
    reset() {
      this.form = resetFormFilter()
      this.currentPage = 1
      this.limit = 20
      this.count = 0
      this.tableData = null
    },
    // 触发分页
    onPagination() {
      this.getList()
    },
    // 获取表格数据
    getList() {
      if (this.selectedType === 'pro') {
        this.doLightManagementGroupsInfoList()
      } else if (this.selectedType === 'gro') {
        this.doLightManagementInfoList()
      } else if (this.selectedType === 'notApproved') {
        this.doGetUnprovedLight()
      }
    },
    // 获取项目下的分组信息
    doLightManagementGroupsInfoList() {
      this.listLoading = true
      lightManagementGroupsInfoList({
        projectId: this.selectedId,
        currentPage: this.currentPage,
        limit: this.limit,
        name: this.form.lightName
      })
        .then(response => {
          this.tableData = response.projectInfo
          this.count = response.count
          // console.log(response.projectInfo)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 获取智能灯信息列表
    doLightManagementInfoList() {
      this.listLoading = true
      lightManagementInfoList({
        groupId: this.selectedId,
        currentPage: this.currentPage,
        limit: this.limit,
        name: this.form.groupName,
        sortType: this.form.orderType

      })
        .then(response => {
          this.tableData = response.lightInfo
          this.count = response.count
          // console.log(response.projectInfo)
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 获取未通过审核的路灯列表
    doGetUnprovedLight() {
      // debugger
      this.listLoading = true
      lightManagement({
        projectName: this.form.projectName,
        groupName: this.form.groupName,
        currentPage: this.currentPage,
        limit: this.limit,
        approved: false
      })
        .then(response => {
          this.tableData = response.list
          this.count = response.count
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 智能灯操作选择器回调
    lightManCommandClick(command) {
      console.log(command)
    },
    unLightManCommandClick(command) {
      console.log(command)
    },
    // table中得check回调
    handleSelectionChange(val) {
      this.checkedTableRows = val
    },
    // 动态为表格中的列 添加class
    colClassName(prop) {
      if (prop === 'laststate1' || prop === 'laststate2' || prop === 'gatewayState') {
        return 'img-cell'
      } else {
        return ''
      }
    },
    // 显示详情
    showDetailDialog(id) {
      this.commonLoading = true
      this.getLightDetails(id)
        .then((response) => {
          const datajson = JSON.parse(response.datajson).data
          const dataDetails = response.details
          if (datajson === 'rs') {
            this.$message.error('网络不畅，请稍后再试！')
            return false
          }
          if (datajson === 'fail') {
            this.$message.error('智能灯未加网，可能因为不在通电时间内，请具体检查原因！')
            return false
          }
          this.lightDetailData_1 = dataDetails
          this.lightDetailData_2 = datajson
          return true
        })
        .then(res => {
          if (res) {
            this.isShowDetailDialog = true
          }
        })
        .finally(() => {
          this.commonLoading = false
        })
    },
    // 获取智能灯详情
    getLightDetails(lightId) {
      return lightDetails(lightId)
    },
    // 显示路灯编辑弹窗
    showLightEditDialog(lightId) {
      this.commonLoading = true
      this.doLightDetailsNP(lightId)
        .then((response) => {
          this.upLightDetailData = response.details
          return true
        })
        .then(res => {
          if (res) {
            this.isShowEditLightDialog = true
          }
        })
        .finally(() => {
          this.commonLoading = false
        })
    },
    // 显示未审核通过路灯详情弹窗
    showNotApprovedDetailDialog(lightId) {
      this.commonLoading = true
      this.doLightDetailsNP(lightId)
        .then(response => {
          this.upLightDetailData = response.details
          return true
        })
        .then(res => {
          if (res) {
            this.isShowReadonlyNotApLightDialog = true
          }
        })
        .finally(() => {
          this.commonLoading = false
        })
    },
    // 获取未通过审核的智能灯详情
    doLightDetailsNP(lightId) {
      return lightDetailsNP(lightId)
    },
    onMapInit() {

    },
    // 更新智能灯的排序等级
    doUpdateOrderPriority(lightId, groupId, newOrderPriority) {
      updateOrderPriority(lightId, groupId, newOrderPriority)
        .then((response) => {
          this.getList()
        })
    },
    // 排序方式改变
    onOrderTypeChange() {
      console.log(123)
      this.getList()
    },
    // 按名称搜索
    lightNameSearch() {
      this.getList()
    },
    // 添加路灯
    doAddLight() {
      // this.isShowAddLightDialog = false
      const addLightParams = this.$refs['addLightDialogForm'].getAddLightParams()
      if (!addLightParams) {
        return
      }
      console.log(addLightParams)
      addLight(addLightParams)
        .then(response => {
          // console.log(response)
          this.isShowAddLightDialog = false
          this.$message('添加成功')
          this.getList()
        })
        .finally(() => {

        })
    },
    doEditLight() {
      const updateLightparams = this.$refs['editLightDialogForm'].getEditLightParams()
      if (!updateLightparams) {
        return
      }
      console.log(updateLightparams)
      updateLight(updateLightparams)
        .then(response => {
          // console.log(response)
          this.isShowEditLightDialog = false
          this.$message('编辑成功')
          this.getList()
        })
        .finally(() => {

        })
    },
    // 删除智能灯
    doDeleteLight() {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.isOneLengthArray(this.checkedTableRows)) { return }
        realdeleteLight(this.checkedTableRows[0].id)
          .then(response => {
            console.log(response)
            this.$message('删除成功')
            this.getList()
          })
      }).catch(() => {

      })
    },
    // 打开编辑智能灯的对话窗
    doOpenEditLightDialog() {
      if (!this.isOneLengthArray(this.checkedTableRows)) { return }
      this.showLightEditDialog(this.checkedTableRows[0].id)
    },
    // 是否是长度为一的数组
    isOneLengthArray(array) {
      if (array.length === 1) {
        return true
      } else if (array.length === 0) {
        this.$message({
          message: '请选择一个设备',
          type: 'warning'
        })
      } else if (array.length > 1) {
        this.$message({
          message: '请只选择一个设备',
          type: 'warning'
        })
      }
      return false
    }
  }
}
</script>

<style>
.img-cell > .cell {
  text-align: center
}
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
.cell .cell-img {
  height: 24px

}
.children-text-align {
  text-align: center
}
.li-label.detail {
  width: 100px;
  display: inline-block;
  font-weight: 700;
  text-align: right;
  padding-right: 10px;
}
.detail-wrap .el-row {
  margin-bottom: 10px
}
.very-mini-btn {
  padding: 7px 5px;
}
</style>
