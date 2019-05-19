<template>
  <div class="app-container">
    <split-pane split="vertical" :default-percent="15" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <pro-gro-selector
            :tree-data="projectGroupData"
            @node-check-change="nodeCheckChange"
          />
        </div>
      </template>
      <template slot="paneR">
        <div id="energy-charts-container" class="right-container">
          <div class="filter-container form-filter">
            <el-form :inline="true" :model="form" size="small">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="form.duration"
                  :default-value="getNow()"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
                <el-button type="primary" @click="form.duration=''">重置时间</el-button>
              </el-form-item>
              <el-form-item label="显示类型">
                <el-radio-group v-model="form.dateType" size="small">
                  <el-radio-button label="year">年能耗</el-radio-button>
                  <el-radio-button label="month">月能耗</el-radio-button>
                  <el-radio-button label="day">日能耗</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="charts-container">
            <energy-analyse-charts
              ref="energyConsumptionChart"
              chart-dom-id="test"
              height="500px"
              :init-chart-opt="energyConsumptionDefaultOpt"
              @export-excel="echartsExportExcel"
            />
            <div style="margin-top: 20px" />
            <energy-analyse-charts
              ref="energySavingChart"
              height="500px"
              :init-chart-opt="energySavingDefaultOpt"
              @export-excel="echartsExportExcel"
            />
          </div>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import { getProjectGroup } from '@/api/light/common'
import { getOneP_GData, getMoreP_GData, getExcelPre, getExcelURL } from '@/api/light/energy-analyse'
import ProGroSelector from '@/components/light/ProGroSelector/index.vue'
import EnergyAnalyseCharts from './components/EnergyAnalyseCharts'
import {
  energySavingDefaultOpt,
  energyConsumptionDefaultOpt
} from './components/EnergyAnalyseCharts/energy-analyse-charts-opt-default'
import { deepClone } from '@/utils'
export default {
  name: 'EnergyAnalyse',
  components: { splitPane, ProGroSelector, EnergyAnalyseCharts },
  data() {
    return {
      form: {
        duration: '',
        dateType: 'day'
      },
      projectGroupData: [], // 项目编组选择树的数据
      energyConsumptionDefaultOpt: energyConsumptionDefaultOpt,
      energySavingDefaultOpt: energySavingDefaultOpt,
      checkMode: null,
      checkedList: [],
      lastReqData: null
    }
  },
  watch: {
    form: {
      handler: function(newVal, oldVal) {
        this.getDataRenderCharts()
      },
      deep: true
    }
  },
  created() {
    this.doGetProjectGroup()
  },
  methods: {
    getNow() {
      return [new Date().valueOf(), new Date().valueOf()]
    },
    resize() {
      this.$refs['energyConsumptionChart'].resize()
      this.$refs['energySavingChart'].resize()
    },
    doGetProjectGroup() {
      return new Promise((resolve, reject) => {
        getProjectGroup()
          .then(response => {
            this.projectGroupData = response
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 项目编组check回调
    nodeCheckChange(checkMode, checkedList) {
      this.checkMode = checkMode
      this.checkedList = checkedList
      this.getDataRenderCharts()
    },
    // 获取数据 渲染图表
    getDataRenderCharts() {
      if (!this.checkMode || this.checkedList.length === 0) {
        this.geneChartsOption(null, false)
      }
      this.getChartsData(this.checkMode, this.checkedList).then(
        ({ chartData, isMulti }) => {
          this.geneChartsOption(chartData, isMulti)
        }
      )
    },
    /**
     * @desc 生成echarts option
     */
    geneChartsOption(chartData, isMulti) {
      const energyConsumptionOpt = deepClone(energyConsumptionDefaultOpt)
      const energySavingOpt = deepClone(energySavingDefaultOpt)
      if (chartData === null) {
        this.$refs['energyConsumptionChart'].setChart(energyConsumptionOpt)
        this.$refs['energySavingChart'].setChart(energySavingOpt)
        return
      }

      if (isMulti) {
        energyConsumptionOpt.xAxis[0].data = chartData.bigArray // 图表1x轴日期数据
        energyConsumptionOpt.legend.data = chartData.p_gNameList // 图例  项目名列表
        energySavingOpt.xAxis[0].data = chartData.bigArray // 图表2x轴日期数据
        energySavingOpt.legend.data = chartData.p_gNameList // 图例  项目名列表
        // 循环得到chartData中的每个项的实际能耗  节能数据，加到图表1图表2的option中
        chartData.moreData.forEach((ele, index, thisMoreData) => {
          // 设置能耗图表的每个项的参数
          energyConsumptionOpt.series.push({
            name: chartData.p_gNameList[index],
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbolSize: 8,
            animation: false,
            smooth: true,
            data: ele.yReal
          })
          // 设置节能图表每个项的参数
          energySavingOpt.series.push({
            name: chartData.p_gNameList[index],
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbolSize: 8,
            animation: false,
            barMaxWidth: 30,
            barMinHeight: 2,
            data: ele.yJieneng
          })
        })
      } else {
        energyConsumptionOpt.xAxis[0].data = chartData.xData
        energySavingOpt.xAxis[0].data = chartData.xData
        energySavingOpt.series = [
          {
            name: '节能',
            type: 'bar',
            barMaxWidth: 30, // 设置柱形最大宽度
            barMinHeight: 2, // 柱形最小高度
            smooth: true,
            itemStyle: {
              normal: { areaStyle: { type: 'default' }, label: { show: false }},
              emphasis: { color: '#1DBB37' }},
            data: chartData.yJieneng // 节能值
          }
        ]
        energyConsumptionOpt.series = [
          {
            name: '传统能耗',
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' }}},
            data: chartData.yTraditional // 传统能耗各值
          },
          {
            name: '额定能耗',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: { areaStyle: { type: 'default' }, label: { show: false }},
              emphasis: { color: '#1DBB37' }
            },
            data: chartData.yRated // 额定能耗各值
          },
          {
            name: '实际能耗',
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' }}},
            data: chartData.yReal // 实际能耗各值
          }
        ]
      }

      this.$refs['energyConsumptionChart'].setChart(energyConsumptionOpt)
      this.$refs['energySavingChart'].setChart(energySavingOpt)
    },
    /**
     * @desc 获取图表数据
     * @param {String} checkMode 选择项目模式 项目还是编组
     * @param {Array<Object>} checkedList 已选择的项目或者编组
     * @returns {Promise<{Object, Boolean}>}  res, isMulti 远程数据，是否是多个项
     */
    getChartsData(checkMode, checkedList) {
      return new Promise((resolve, reject) => {
        const reqData = {
          type: this.form.dateType,
          startTime: this.form.duration[0] || null,
          endTime: this.form.duration[1] || null,
          projectId: [],
          groupId: []
        }

        let request = null
        const key = checkMode === 'pro' ? 'projectId' : 'groupId'
        let isMulti = null // 是否是多个项

        if (checkedList.length === 0) {
          //  没有项
          resolve(null)
        } else if (checkedList.length === 1) {
          // 单个项
          reqData[key].push(checkedList[0].id)
          request = getOneP_GData
          isMulti = false
        } else {
          // 多个项
          reqData[key] = checkedList.map(ele => ele.id)
          request = getMoreP_GData
          isMulti = true
        }
        this.lastReqData = reqData
        request(reqData).then(res => {
          resolve({ chartData: res, isMulti })
        })
      })
    },
    /**
     * 导出excel
     */
    echartsExportExcel() {
      if (!this.lastReqData) {
        this.$message({
          message: '请先选择项目或编组',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }

      getExcelPre(this.lastReqData).then(res => {
        console.log(getExcelURL)
        window.open(getExcelURL, '_blank')
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  position: relative;
  height: calc(100vh - 84px);
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
</style>

<style lang="scss">
.el-date-editor .el-range-separator {
  width: 8%;
}
</style>
