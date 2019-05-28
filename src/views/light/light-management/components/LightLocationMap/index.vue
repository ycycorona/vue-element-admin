<template>
  <div style="width: 100%;height:300px" />
</template>

<script>
// import { deepClone } from '@/utils'
import VueAMap from 'vue-amap'
import Vue from 'vue'
import { lazyAMapApiLoaderInstance } from 'vue-amap'
// 高德地图
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '614fac7b5072ab20e6d7d4c600da8a7a',
  plugin: ['Scale', 'ToolBar'],
  v: '1.4.10' // 高德 sdk 版本为 1.4.4
  // uiVersion: '1.0.11' // 高德UI版本号
})
export default {
  name: 'LightLocationMap',
  props: {
    lng: {
      type: String,
      required: true
    },
    lat: {
      type: String,
      required: true
    },
    isDraggable: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      aMapIns: null,
      currentMakerPosition: {
        lat: null,
        lng: null
      }
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapInit()
      this.$emit('map-init-success')
      console.log('高德地图初始化完成')
    })
  },
  methods: {
    async mapInit() {
      // eslint-disable-next-line
      this.aMapIns = new AMap.Map(this.$el, {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 15
        // mapStyle: 'amap://styles/light'
      })
      // eslint-disable-next-line
      const scale = new AMap.Scale({
        visible: true
      })
      // eslint-disable-next-line
      const toolBar = new AMap.ToolBar({
        visible: true
      })
      this.aMapIns.addControl(scale) // 添加比例尺
      this.aMapIns.addControl(toolBar) // 添加工具栏

      this.aMapIns.setCenter([this.lng, this.lat])
      this.setMarker()
    },
    setMarker() {
      // eslint-disable-next-line
      const marker = new AMap.Marker({
        map: this.aMapIns,
        position: [this.lng, this.lat],
        draggable: this.isDraggable
      })
      marker.on('mouseup', () => {
        this.currentMakerPosition = marker.getPosition()
        this.$emit('drag-position', this.currentMakerPosition)
      })
    }
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>

</style>
