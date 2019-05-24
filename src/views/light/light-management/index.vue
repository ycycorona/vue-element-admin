<template>
  <div class="full-height-app-container ">
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
              <el-form-item label="">
                <el-button type="primary" size="small">刷新</el-button>
              </el-form-item>
              <el-form-item v-if="selectedType==='notApproved'" label="">
                <el-button type="primary" size="small" @click="isShowAddLightDialog=true">添加</el-button>
              </el-form-item>
              <el-form-item v-if="selectedType==='notApproved'" label="">
                <el-button type="primary" size="small">修改</el-button>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" size="small">删除</el-button>
              </el-form-item>
              <el-form-item label="">
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
                <el-input v-model="form.name" placeholder="按路灯编号查询" style="width:50%" />
                <el-button type="primary" size="small" @click="lightNameSearch">搜索</el-button>
              </el-form-item>

              <el-form-item v-else>
                <el-input v-model="form.name" placeholder="按编组名称查询" style="width:50%" />
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
                    <!-- 一路二路灯光状态 -->
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
    <!-- 路灯详情弹窗 -->
    <el-dialog :visible.sync="isShowDetailDialog" title="路灯详情" width="30%" style="min-width: 300px">
      <div v-loading="dialogLoading" class="detail-wrap">
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
              <span class="li-label detail">路灯编号</span>
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
    <el-dialog :visible.sync="isShowAddLightDialog" title="添加路灯" width="50%" style="min-width: 300px">
      <add-light-pop :project-group-light-data="projectGroupLightData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowAddLighDialog = false">确定</el-button>
        <el-button @click="isShowAddLighDialog = false">取消</el-button>
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

const imgs = {
  lightGb, lightGz, lightDengdai, lightKd, lightGd, gatewayOnline, gatewayOutline
}

// import { deepClone } from '@/utils'
import splitPane from 'vue-splitpane'
import { getProjectGrouplight } from '@/api/light/common'
import { lightManagementGroupsInfoList,
  lightManagementInfoList, lightDetails, updateOrderPriority } from '@/api/light/light-management'
import ProGroSingleSel from './components/ProGroSingleSel'
import { TableThMapPro, TableThMapGro, OrderTypesOpt } from '@/config/light'
import Pagination from '@/components/Pagination'

function resetFormFilter() {
  return {
    orderType: 1,
    name: ''
  }
}

export default {
  name: 'LightManagement',

  components: {
    ProGroSingleSel, splitPane, Pagination, LightLocationMap, AddLightPop
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
      dialogLoading: false, // 详情对话框载入中
      isShowDetailDialog: false,
      isShowAddLightDialog: false,
      lightDetailData_1: null,
      lightDetailData_2: null
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
      // console.log(selectedId, selectedType)
      this.selectedId = selectedId
      this.selectedType = selectedType
      this.reset()
      this.getList()
    },
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
        //
      }
    },
    // 获取项目下的分组信息
    doLightManagementGroupsInfoList() {
      this.listLoading = true
      lightManagementGroupsInfoList({
        projectId: this.selectedId,
        currentPage: this.currentPage,
        limit: this.limit,
        name: this.form.name
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
    // 获取路灯信息列表
    doLightManagementInfoList() {
      this.listLoading = true
      lightManagementInfoList({
        groupId: this.selectedId,
        currentPage: this.currentPage,
        limit: this.limit,
        name: this.form.name,
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
    // 路灯操作选择器回调
    lightManCommandClick(command) {
      console.log(command)
    },
    // table中得check回调
    handleSelectionChange(val) {
      this.checkedTableRow = val
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
      this.isShowDetailDialog = true
      this.getLightDetails(id)
    },
    // 获取路灯详情
    getLightDetails(lightId) {
      this.dialogLoading = true
      lightDetails(lightId)
        .then((response) => {
          const datajson = JSON.parse(response.datajson).data
          const dataDetails = response.details
          if (datajson === 'rs') {
            this.$message.error('网络不畅，请稍后再试！')
            return
          }
          if (datajson === 'fail') {
            this.$message.error('路灯未加网，可能因为不在通电时间内，请具体检查原因！')
            return
          }
          this.lightDetailData_1 = dataDetails
          this.lightDetailData_2 = datajson
        })
        .finally(() => {
          this.dialogLoading = false
        })
    },
    onMapInit() {

    },
    // 更新路灯的排序等级
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
