<template>
  <div class="map-device-page">
    <split-pane split="vertical" :min-percent="15" :default-percent="15" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <div v-show="isShowDetail">
            <div class="detail-wrap">
              <div class="close-detail-wrap" style="">
                <i class="el-icon-close" @click="isShowDetail=false" />
              </div>
              <div class="detail-title">设备详情<span class="detail-title-line" /></div>
              <div v-if="Object.keys(detailDevice).length!==0" class="detail-list">
                <div v-for="(item, index) in detailDeviceDic" :key="index">
                  <template v-if="item.value==='state'">
                    <span>{{ item.label }}</span>
                    <span>{{ detailDevice[item.value]===1 ? '正常' : '故障' }}</span>
                  </template>
                  <template v-if="item.value==='qrcode'" style="position:relative">
                    <span>{{ item.label }}：</span>
                    <span style="position: absolute;"><img width="100px" src="/static/img/device-map/qrcode.png" alt=""></span>
                  </template>
                  <template v-else>
                    <span>{{ item.label }}：</span>
                    <span>{{ detailDevice[item.value]===null ? '' : detailDevice[item.value] }}</span>
                  </template>
                </div>
              </div>
            </div>
            <div v-if="Object.keys(detailDevice).length!==0" class="fix-wrap">
              <div class="detail-title">维修历史<span class="detail-title-line" /></div>
              <div v-if="detailDevice.state===0" class="fix-detail">
                <div>第一次维修</div>
                <div>
                  <span>维修时间：</span>
                  <span>2020-04-09 13:13:29</span>
                </div>
                <div>
                  <span>故障类型：</span>
                  <span>无法判断</span>
                </div>
                <div>
                  <span>维修方式：</span>
                  <span>人工服务</span>
                </div>
              </div>
              <div v-else>
                <span style="font-size:14px">暂无维修记录</span>
              </div>
            </div>
          </div>
          <div v-show="!isShowDetail">
            <div class="back-wrap">
              <i class="el-icon-back" @click="backToPrePage" />
            </div>
            <div class="swarch-wrap">
              <el-input v-model="searchData" class="search-input" style="width:180px" placeholder="请输入搜索内容" size="small" />
              <el-button type="primary" icon="el-icon-search" class="search-btn" size="small" style="margin-left:-4px" @click="onSearch" />
            </div>
            <div class="list-wrap">
              <!-- :current-node-key="" -->
              <el-tree
                ref="device-tree"
                :filter-node-method="filterFun"
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
import devicePositionList from '@/config/devicePosition'
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
const detailDeviceDic = [
  {
    label: '设备名称',
    value: 'name'
  },
  {
    label: '设备类型',
    value: 'typeName'
  },
  {
    label: '设备故障',
    value: 'state'
  },
  {
    label: '设备品牌',
    value: 'brandName'
  },
  {
    label: '设备型号',
    value: 'versionName'
  },
  {
    label: '设备ip',
    value: 'ip'
  },
  {
    label: '设备位置',
    value: 'positionName'
  },
  {
    label: '安装时间',
    value: 'createdat'
  },
  {
    label: '二维码',
    value: 'qrcode'
  }
]
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
    name: '停车场系统',
    children: [{
      id: 103,
      name: '车牌识别一体机',
      type: 2,
      children: []
    }, {
      id: 99,
      name: '道闸',
      type: 2,
      children: []
    }]
  }
]
// 获取push路径字典
const pushPathMap = {}
sysList.forEach(sys => {
  sys.children && sys.children.forEach(deviceType => {
    pushPathMap[deviceType.id] = deviceType.children
  })
})
const idPositionDic = {}
devicePositionList.forEach(device => { idPositionDic[Number(device.id)] = [device.lng, device.lat] })
// 通过push路径字典，把设备push进对应的列表
deviceList
  .filter(device => (device.id in idPositionDic))
  .map(device => {
    device.lng = idPositionDic[device.id][0]
    device.lat = idPositionDic[device.id][1]
    return device
  })
  .forEach(device => {
    if (device.dtid in pushPathMap) {
      pushPathMap[device.dtid].push({
        id: device.id,
        name: device.number,
        sysId: device.cid,
        sysName: device.cname,
        brandName: device.brand,
        typeName: device.name,
        positionName: device.position,
        createdat: device.createdat,
        state: device.state !== null ? device.state : 1, // 是否损坏
        type: 3, // 具体设备
        versionName: device.version,
        ip: device.ip,
        lng: device.lng,
        lat: device.lat
      })
    }
  })
// console.log(sysList)
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
      infoWindow: null,
      labelLayer: null,
      buildLayer: null,
      markers: [],
      isShowDetail: false,
      detailDevice: {},
      detailDeviceDic,
      currentDevice: null
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
    // 取消突出选中设备
    this.$on('map-info-close', () => {
      this.detailDevice = {}
      if (!this.currentDevice) { return }
      this.currentDevice.setIcon({ size: [26, 26] })
    })
    this.$on('map-info-open', () => {
      if (!this.currentDevice) { return }
      this.currentDevice.setIcon({ size: [52, 52] })
    })
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
      // console.log('resize')
    },
    async initAMap() {
      try {
        const AMap = await MapLoader()
        const buildLayer = this.createBuildsLyer()
        const labelLayer = this.createLabelLayer()
        this.map = new AMap.Map('map-container', {
          // mask: redLeafShapePath,
          resizeEnable: true, // 是否监控地图容器尺寸变化
          expandZoomRange: true, // 扩大缩放最大级别
          center: [117.039365, 36.608104],
          showIndoorMap: false,
          zoom: 18, // 缩放级
          zooms: [18, 20],
          pitch: 50, // 地图俯仰角度，有效范围 0 度- 83 度
          viewMode: '3D', // 地图模式
          // mapStyle: 'amap://styles/whitesmoke',
          features: ['bg', 'road', 'point'],
          layers: [
            // 高德默认标准图层
            new AMap.TileLayer(),
            buildLayer,
            labelLayer
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
          content: '',
          offset: new AMap.Pixel(0, -52)
        })
        this.infoWindow.on('close', () => {
          this.$emit('map-info-close')
        })
        this.infoWindow.on('open', () => {
          this.$emit('map-info-open')
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
          color1: 'FFEDECE5', // 楼顶颜色
          color2: 'FFC0BFB9', // 楼面颜色
          path: redLeafShapePath
        }]
      }
      // 楼块图层
      // eslint-disable-next-line
      const buildLayer = new AMap.Buildings({
        zooms: [16, 20],
        merge: false,
        zIndex: 130,
        sort: false,
        opacity: 0.9
        // heightFactor: 2 // 2倍于默认高度，3D下有效
      })
      buildLayer.setStyle(options)
      this.buildLayer = buildLayer
      return buildLayer
    },
    // 创建label图层
    createLabelLayer() {
      // eslint-disable-next-line
      const layer = new AMap.LabelsLayer({
        zooms: [18, 20],
        zIndex: 200,
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: false,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true
      })
      this.labelLayer = layer
      return layer
    },
    createBoundry(path, map, fillColor) {
      // eslint-disable-next-line
      new AMap.Polygon({
        bubble: true,
        fillColor: fillColor,
        strokeColor: fillColor,
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
      // 清理
      this.cleanDevices()
      traveler(currentDev, 'children', (device) => this.mapDevice.push(device))
      this.currentDeviceCollectionId = currentDev.id
      this.renderMapDevice()
      // this.$refs['device-tree'].setCurrentKey(currentDev.id)
    },
    // 渲染地图设备
    renderMapDevice() {
      // console.log(this.mapDevice)
      this.mapDevice.forEach(device => {
        const marker = this.addDevice(device.lng, device.lat, device)
        this.markers.push(marker)
        // console.log(marker)
        this.labelLayer.add(marker)
      })
    },
    // 添加设备点
    addDevice(lng, lat, item) {
      // eslint-disable-next-line
      const endMarker = new AMap.LabelMarker( {

        clickable: true,
        // eslint-disable-next-line
        position: new AMap.LngLat(lng, lat),
        zIndex: 201,
        name: item.id,
        icon: {
          image: this.deviceIconSelector(item),
          size: [26, 26],
          ancher: 'bottom-center'
        },
        text: {
          content: item.name,
          direction: 'bottom',
          zooms: [19, 20],
          style: {
            fillColor: '#00cbe0',
            fontSize: 12
          }
        }
      })
      endMarker.extData = {
        id: item.id
      }

      endMarker.on('click', this.deviceClick.bind(this, item))
      return endMarker
    },
    // 点击地图设
    deviceClick(device, e) {
      // info窗口未关闭 直接返回
      if (this.infoWindow.getIsOpen()) { return }
      try {
        const stateMap = {
          0: '故障',
          1: '正常'
        }
        this.infoWindow.setContent('')
        const content = document.createElement('div')
        const btn = document.createElement('div')
        btn.classList.add('more-btn')

        // 查看更多详情
        btn.addEventListener('click', (ev) => {
          this.showDetail(device)
          ev.stopPropagation
        }, false)
        btn.innerHTML = '查看更多'
        if (device.state === 0) {
          btn.style.color = 'red'
          btn.style.borderColor = 'red'
        }
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
        content.append(btn)

        this.infoWindow.setContent(content)
        this.currentDevice = e.target // 当前地图中设备点 对象
        this.detailDevice = device // 当前地图中设备 数据
        this.infoWindow.open(this.map, e.target.getPosition())

        // 突出选中设备
        // e.target.setIcon({ size: [52, 52] })
      } catch (err) {
        console.log(err)
      }
    },
    showDetail(device) {
      this.isShowDetail = true
      this.detailDevice = device
      console.log(device)
    },
    // 设备图标选择器
    deviceIconSelector(device) {
      const code = '' + device.sysId + device.state
      return '/static/img/device-map/' + code + '.png'
    },
    filterFun(value, data, node) {
      // console.log(value, data, node)
      if (value === '') { return true }
      if (data.name.indexOf(value) === -1) {
        return false
      } else {
        return true
      }
    },
    onSearch() {
      this.$refs['device-tree'].filter(this.searchData)
      this.cleanDevices()
    },
    // 清除设备显示及相关
    cleanDevices() {
      // 清理
      this.mapDevice = []
      this.markers = []
      this.labelLayer.clear()
      if (this.infoWindow.getIsOpen()) {
        this.infoWindow.close()
      }
    },
    // 返回来的页面
    backToPrePage() {
      window.location.href = this.origin_href
    }

  }
}
</script>

<style lang="scss">
$--color-primary: #00cbe0;
.more-btn {
    border: solid $--color-primary 2px;
    margin: 10px 20px;
    border-radius: 20px;
    padding: 6px;
    text-align: center;
    color: $--color-primary;
    cursor: pointer;
}
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

.el-icon-back, .el-icon-close {
  font-size: 25px;
  font-weight: 700;
  color: grey;
  cursor: pointer;
}
.el-icon-back:hover, .el-icon-close:hover  {
  color: $--color-primary
}

.back-wrap, .close-detail-wrap {
  margin: 10px 0;
}
.close-detail-wrap {
 text-align: right;
}
.device-tree.el-tree--highlight-current ::v-deep .el-tree-node.is-current>.el-tree-node__content {
  color: $--color-primary;
}

.detail-list {
  line-height: 1.6;
  font-size: 14px;
}
.detail-title{
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 2px;
}
.detail-title-line {
  width: 24px;
  display: inline-block;
  height: 2px;
  position: absolute;
  bottom: 0;
  left: 25px;
  border-bottom: 3px solid $--color-primary;
}
.fix-wrap {
  margin-top: 100px;
}
.fix-detail {
    line-height: 1.6;
    font-size: 14px;}
</style>
