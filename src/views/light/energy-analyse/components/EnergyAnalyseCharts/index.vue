<template>
  <div>
    <div class="btn-container">
      <el-button type="primary" size="mini" @click="print">生成报表</el-button>
      <el-button type="primary" size="mini" @click="$emit('export-excel')">导出到Excel</el-button>
    </div>
    <div :id="chartDomId" ref="echartDom" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import printJS from 'print-js'
// const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '95%'
    },
    height: {
      type: String,
      default: '500px'
    },
    // chartOption: {
    //   type: Object,
    //   default: () => {}
    // },
    initChartOpt: {
      type: Object,
      default: () => {}
    },
    chartDomId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs['echartDom'])
      this.chart.setOption(this.initChartOpt)
    },
    setChart(chartOption) {
      // debugger
      this.chart.setOption(chartOption, true)
    },
    resize() {
      console.log(123)
      this.__resizeHandler()
    },
    print() {
      // const style = `@page { margin: 0 } @media print { #${this.imgId} {width:100%}}`
      const chartImg = this.chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff',
        excludeComponents: ['toolbox']
      })
      printJS({
        printable: chartImg, // 要打印内容
        type: 'image'
        // maxWidth: 1600,
        // style: style,
        // scanStyles: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-container {
  text-align: right;
  padding-right: 10px
}
.echarts-img {
  display: none
}
</style>

