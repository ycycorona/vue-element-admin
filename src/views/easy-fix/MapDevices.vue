<template>
  <div class="map-device-page">
    <split-pane split="vertical" :min-percent="15" :default-percent="15" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <div class="back-wrap">
            <i class="el-icon-back" @click="backToPrePage" />
          </div>
          <div class="swarch-wrap">
            <el-input v-model="searchData" class="search-input" style="width:180px" placeholder="请输入搜索内容" size="small" />
            <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" style="margin-left:-4px" />
          </div>
          <div class="list-wrap">
            <el-tree
              ref="device-tree"
              :current-node-key="2"
              node-key="id"
              accordion
              class="device-tree"
              highlight-current
              :data="list"
              :props="propsDefine"
              @current-change="onCurrentDevChange"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <div id="map-container" :style="{width: '100%', height: '100%'}" />
        </div>
      </template>
    </split-pane>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane'
import MapLoader from '@/utils/map/AMAP'
import { redLeafShapePath } from '@/config/shapeData'
import deviceList from '@/config/deviceList'
function rowFactory(label, value) {
  const row = document.createElement('div')
  const spanLabel = document.createElement('span')
  const spanValue = document.createElement('span')
  spanLabel.classList.add('span-label')
  spanValue.classList.add('span-value')
  spanLabel.innerHTML = label
  spanValue.innerHTML = value
  row.append(spanLabel)
  row.append(spanValue)
  return row
}
// 遍历出最后一级的子元素
function traveler(target, travelKey, callback) {
  if (!target[travelKey]) {
    callback(target)
    return
  }
  target[travelKey].forEach(item => {
    if (item[travelKey] instanceof Array) {
      traveler(item, travelKey, callback)
    } else {
      callback(item)
    }
  })
}
// type 1系统 2设备分类 3具体设备
// 最后一级 没有children字段
const sysList = [
  {
    id: 1,
    name: '楼宇可视对讲系统',
    type: 1,
    children: [
      {
        id: 179,
        name: '梯口主机',
        type: 2,
        children: []
      }
    ]
  },
  {
    id: 2,
    name: '门禁一卡通系统',
    type: 1,
    children: [
      {
        id: 192,
        name: '嵌入式读卡器',
        type: 2,
        children: []
      },
      {
        id: 196,
        name: '门禁控制器',
        type: 2,
        children: []
      }
    ]
  },
  {
    id: 5,
    type: 1,
    name: '视频监控系统',
    children: [{
      id: 32,
      name: '枪式摄像机',
      type: 2,
      children: []
    }]
  },
  {
    id: 6,
    type: 1,
    name: '停车场系统'
  },
  {
    id: 7,
    type: 1,
    name: '背景音乐系统'
  }
]
// 获取push路径字典
const pushPathMap = {}
sysList.forEach(sys => {
  sys.children && sys.children.forEach(deviceType => {
    pushPathMap[deviceType.id] = deviceType.children
  })
})
// 通过push路径字典，把设备push进对应的列表
deviceList.forEach(device => {
  if (device.dtid in pushPathMap) {
    pushPathMap[device.dtid].push({
      id: device.id,
      name: device.number,
      sysId: device.cid,
      sysName: device.cname,
      brandName: device.brand,
      state: 1, // 是否损坏
      type: 3, // 具体设备
      versionName: device.version
    })
  }
})
console.log(sysList)
// 颜色需要补00 带透明度
// const roofColor = 'c2947900'
// const buildingColor = 'f5ecc700'
export default {
  name: 'MapDevices',
  components: { splitPane },
  data() {
    return {
      map: null,
      mapDevice: [],
      currentPos: null,
      searchData: '',
      currentDeviceCollectionId: 2,
      list: sysList,
      propsDefine: {
        children: 'children',
        label: 'name'
      },
      zoomMapping: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0
      },
      infoWindow: null
    }
  },
  computed: {
    origin_href() {
      return this.$route.query.origin_href
    }
  },
  watch: {

  },
  created() {

    // this.$on('window-resize', function(ev) {
    //   // const dom = document.querySelector('.right-container')
    //   // console.log(dom.scrollHeight)
    //   // console.log(dom.scrollWidth)
    // })
  },
  async mounted() {
    const _this = this
    window.addEventListener('resize', function(ev) {
      _this.$emit('window-resize', ev)
    })
    await this.initAMap()
    this.createBoundry(redLeafShapePath, this.map, 'green')
  },
  destroyed() {

  },
  methods: {
    resize() {
      console.log('resize')
    },
    async initAMap() {
      try {
        const AMap = await MapLoader()
        const buildLayer = this.createBuildsLyer()
        this.map = new AMap.Map('map-container', {
          // mask: redLeafShapePath,
          resizeEnable: true, // 是否监控地图容器尺寸变化
          center: [117.039365, 36.608104],
          showIndoorMap: false,
          zoom: 18, // 缩放级别，最大18
          zooms: [17, 20],
          pitch: 50, // 地图俯仰角度，有效范围 0 度- 83 度
          viewMode: '3D', // 地图模式
          mapStyle: 'amap://styles/light',
          features: ['bg', 'road', 'point'],
          layers: [
            // 高德默认标准图层
            new AMap.TileLayer(),
            buildLayer
          ]
        })
        const scale = new AMap.Scale({
          visible: true
        })

        const toolBar = new AMap.ToolBar({
          visible: true
        })
        this.infoWindow = new AMap.InfoWindow({
          closeWhenClickMap: true,
          content: ''
        })
        this.map.addControl(scale) // 添加比例尺
        this.map.addControl(toolBar) // 添加工具栏
      } catch (err) {
        console.error(err)
      }
    },
    createBuildsLyer() {
      const options = {
        hideWithoutStyle: true, // 是否隐藏设定区域外的楼块
        areas: [{ // 围栏1
          // color1: roofColor, // 楼顶颜色
          // color2: buildingColor, // 楼面颜色
          color1: 'ffffff00', // 楼顶颜色
          color2: 'ffffcc00', // 楼面颜色
          path: redLeafShapePath
        }]
      }
      // 楼块图层
      // eslint-disable-next-line
      const buildLayer = new AMap.Buildings({
        zooms: [16, 20],
        merge: false,
        zIndex: 130,
        sort: false
        // heightFactor: 2 // 2倍于默认高度，3D下有效
      })
      buildLayer.setStyle(options)
      return buildLayer
    },
    createBoundry(path, map, fillColor) {
      // eslint-disable-next-line
      new AMap.Polygon({
        bubble: true,
        fillColor: fillColor,
        fillOpacity: 0.2,
        strokeWeight: 1,
        path: path,
        map: map
      })
    },
    handleNodeClick(data) {
      // console.log(data)
    },
    // 当前选中点改变
    onCurrentDevChange(currentDev) {
      // 未发生变化 直接返回
      if (currentDev.id === this.currentDeviceCollectionId) { return }
      this.mapDevice = []
      traveler(currentDev, 'children', (device) => this.mapDevice.push(device))
      this.currentDeviceCollectionId = currentDev.id
      this.renderMapDevice()
      // this.$refs['device-tree'].setCurrentKey(currentDev.id)
    },
    renderMapDevice() {
      this.mapDevice.forEach(device => {
        const marker = this.addDevice(117.039365, 36.608104, device)
        this.map.add(marker)
      })
    },
    // 添加设备点
    addDevice(lng, lat, item) {
      // eslint-disable-next-line
      const endMarker = new AMap.ElasticMarker({
        extData: {
          id: item.id
        },
        // eslint-disable-next-line
        position: new AMap.LngLat(lng, lat),
        styles: [{
          icon: {
            img: this.deviceIconSelector(item),
            size: [26, 26],
            ancher: [13, 26],
            fitZoom: 16,
            scaleFactor: 2,
            maxScale: 1,
            minScale: 1
          },
          label: {
            content: item.name,
            offset: [0, 0],
            position: 'BL',
            minZoom: 18// label的最小显示级别
          }
        }],
        zoomStyleMapping: this.zoomMapping
      })
      endMarker.on('click', this.deviceClick.bind(this, item))
      return endMarker
    },
    // 点击地图设备
    deviceClick(device, e) {
      const stateMap = {
        0: '故障',
        1: '正常'
      }
      this.infoWindow.setContent('')
      const content = document.createElement('div')

      const deviceNameRow = rowFactory('设备名称：', device.name)
      const sysNameRow = rowFactory('所属系统：', device.sysName)
      const stateRow = rowFactory('设备状态：', stateMap[device.state])
      const brandRow = rowFactory('设备品牌：', device.brandName)
      const modelRow = rowFactory('设备型号：', device.versionName)

      content.append(deviceNameRow)
      content.append(sysNameRow)
      content.append(stateRow)
      content.append(brandRow)
      content.append(modelRow)

      this.infoWindow.setContent(content)
      this.infoWindow.open(this.aMapIns, e.target.getPosition())
    },
    // 设备图标选择器
    deviceIconSelector(device) {
      const code = '' + device.sysId + device.state
      return '/static/img/device-map/' + code + '.png'
    },
    // 返回来的页面
    backToPrePage() {
      window.location.href = this.origin_href
    }

  }
}
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>
$--color-primary: #00cbe0;
// @import '@/styles/element-variables.scss';
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.map-device-page {
  width: 100%;
  height: 100%;
}

.left-container {
  background-color: transparent;
  height: 100%;
  padding: 0 10px
}
.right-container {
  background-color: transparent;
  height: 100%;
}
.swarch-wrap {
  //width: 225px;
  //margin: auto;
  box-sizing: border-box;
}
.list-wrap {
  margin-top: 10px;
}
.search-btn {
  border-top-left-radius: 0;
  margin-left: -5px;
  border-bottom-left-radius: 0;
}

.search-input ::v-deep input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.el-icon-back {
  font-size: 25px;
  font-weight: 700;
  color: grey;
  cursor: pointer;
}
.el-icon-back:hover {
  color: $--color-primary
}
.back-wrap {
  margin: 10px 0;
}
.device-tree.el-tree--highlight-current ::v-deep .el-tree-node.is-current>.el-tree-node__content {
  color: $--color-primary;
}
</style>
