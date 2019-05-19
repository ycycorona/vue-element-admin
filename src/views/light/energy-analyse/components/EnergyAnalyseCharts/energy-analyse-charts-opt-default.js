export const energyConsumptionDefaultOpt = {
  title: {
    show: true,
    text: '能耗统计',
    y: 'top',
    textAlign: 'left',
    textStyle: { color: 'rgb(130, 126, 126)', fontSize: 18 },
    x: 'left',
    padding: 10
  },
  dataZoom: { show: true, realtime: true, start: 50, end: 100 },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      lineStyle: { type: 'solid' }
    }
  },
  legend: {
    data: ['传统能耗', '额定能耗', '实际能耗'],
    textStyle: { color: 'rgb(0, 0, 0)', fontWeight: 'bolder', fontSize: 15 },
    selectedMode: 'multiple'
  },
  toolbox: {// 工具箱
    feature: {
      dataView: { readOnly: true },
      magicType: { type: ['line', 'bar', 'stack', 'tiled'], show: true },
      restore: { show: true },
      saveAsImage: { show: true }
    },
    show: true,
    x: 'right',
    orient: 'vertical',
    padding: 30,
    itemGap: 25
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [],
      position: 'bottom',
      nameTextStyle: { color: 'rgb(0, 0, 0)' },
      axisLine: { lineStyle: { color: 'rgb(0, 0, 0)' }, show: true },
      axisLabel: {// 轴分段指示内容
        show: true,
        textStyle: { color: 'rgb(0, 0, 0)' },
        /* interval:"auto"
          function(index,value){
          //console.log(index+"BB");
          return index % 2==0 ? "" :value
        },*/
        formatter: function(value) {
          if (value.length > 7) { // 如果x轴值长度大于多少就截取掉年  其余正常
            return value.substring(5)
          }
          return value // 去掉年份，只保留月和日
        }
      },
      axisTick: {
        show: true,
        lineStyle: { color: 'rgb(0, 0, 0)' }
      },
      splitLine: { show: false }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgb(0, 0, 0)' }, show: true },
      axisLabel: {// 刻度值
        show: true,
        textStyle: { color: 'rgb(0, 0, 0)' },
        formatter: function(value) {
          if (value >= 10000) {
            return value / 10000 + '万'
          } else {
            return value
          }
        }
      },
      axisTick: {
        show: true, lineStyle: { color: 'rgb(0, 0, 0)' }
      },
      name: 'KW/h',
      nameTextStyle: { fontWeight: 'bold', baseline: 'bottom', align: 'center' }
      // splitNumber:3
    }
  ],
  series: [],
  color: ['rgb(244, 244, 19)', 'rgb(44, 247, 44)', 'rgb(129, 129, 244)', 'rgb(255, 0, 127)', 'rgb(0, 0, 255)', 'rgb(76, 76, 76)', 'rgb(255, 86, 86)'],
  backgroundColor: 'rgb(255, 255, 255)',
  animation: false, // 不启用动画
  grid: {
    backgroundColor: 'rgb(255, 255, 255)',
    left: '6%',
    top: '20%'
  }
}

export const energySavingDefaultOpt = {
  title: {
    show: true,
    text: '节能统计',
    y: 'top',
    textAlign: 'left',
    textStyle: { color: 'rgb(130, 126, 126)', fontSize: 18 },
    x: 'left',
    padding: 5
  },
  dataZoom: { show: true, realtime: true, start: 50, end: 100 },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: { lineStyle: { type: 'solid' }}
  },
  legend: {
    data: ['节能'],
    textStyle: { color: 'rgb(0, 0, 0)', fontWeight: 'bolder', fontSize: 15 },
    selectedMode: 'multiple'
  },
  toolbox: {// 工具箱
    feature: {
      dataView: { readOnly: true },
      magicType: { type: ['line', 'bar', 'stack', 'tiled'], show: true },
      restore: { show: true },
      saveAsImage: { show: true }
    },
    show: true,
    x: 'right',
    orient: 'vertical',
    padding: 30,
    itemGap: 25
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: true, // 起始和结束两端空白策略  柱形图需要
      data: [],
      position: 'bottom',
      nameTextStyle: { color: 'rgb(0, 0, 0)' },
      axisLine: { lineStyle: { color: 'rgb(0, 0, 0)' }, show: true },
      axisLabel: {// 轴分段指示内容
        show: true,
        textStyle: { color: 'rgb(0, 0, 0)' },
        /* interval:"auto"
          function(index,value){
          //console.log(index+"BB");
          return index % 2==0 ? "" :value
        },*/
        formatter: function(value) {
          if (value.length > 7) { // 如果x轴值长度大于多少就截取掉年  其余正常
            return value.substring(5)
          }
          return value // 去掉年份，只保留月和日
        }
      },
      axisTick: { show: true, lineStyle: { color: 'rgb(0, 0, 0)' }},
      splitLine: { show: false }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgb(0, 0, 0)' }, show: true },
      axisLabel: {// 刻度值
        show: true,
        textStyle: { color: 'rgb(0, 0, 0)' },
        formatter: function(value) {
          if (value >= 10000) {
            return value / 10000 + '万'
          } else {
            return value
          }
        }
      },
      axisTick: {
        show: true,
        lineStyle: { color: 'rgb(0, 0, 0)' }
      },
      name: 'KW/h',
      nameTextStyle: { fontWeight: 'bold', baseline: 'bottom', align: 'center' }
      // splitNumber:3
    }
  ],
  series: [],
  color: ['rgb(44, 247, 44)', 'rgb(244, 244, 19)', 'rgb(129, 129, 244)', 'rgb(255, 0, 127)', 'rgb(0, 0, 255)', 'rgb(76, 76, 76)', 'rgb(255, 86, 86)'],
  backgroundColor: 'rgb(255, 255, 255)',
  animation: false, // 不启用动画
  grid: {
    left: '6%',
    top: '20%'
  }
}
