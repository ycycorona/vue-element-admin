<template>
  <div :class="className" :style="{height:height,width:width,'min-width':'1000px'}" />
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'

// const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
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
      console.log(123)
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
      this.chart = echarts.init(this.$el)
      this.chart.setOption(this.initChartOpt)
    },
    setChart(chartOption) {
      // debugger
      this.chart.setOption(chartOption, true)
    },
    resize() {
      console.log(123)
      this.__resizeHandler()
    }
  }
}
</script>
