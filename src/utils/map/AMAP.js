export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = false
      script.src =
        'https://webapi.amap.com/maps?v=1.4.15&key=614fac7b5072ab20e6d7d4c600da8a7a&plugin=AMap.Geocoder,AMap.Scale,AMap.ToolBar,ElasticMarker&callback=initAMap'
      script.onerror = reject
      document.head.appendChild(script)

      // const uiScript = document.createElement('script')
      // uiScript.type = 'text/javascript'
      // uiScript.async = false
      // uiScript.src =
      //   'https://webapi.amap.com/ui/1.0/main-async.js'
      // uiScript.onerror = reject
      // document.head.appendChild(uiScript)
    }
    window.initAMap = () => {
      // eslint-disable-next-line
      //initAMapUI()
      // eslint-disable-next-line
      // AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
      //   resolve(window.AMap)
      // })
      resolve(window.AMap)
    }
  })
}
