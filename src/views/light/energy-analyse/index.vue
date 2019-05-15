<template>
  <div class="app-container">
    <split-pane split="vertical" @resize="resize" :default-percent='15'>
      <template slot="paneL">
        <div class="left-container" />
      </template>
      <template slot="paneR">

      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'

export default {
  name: 'energy-analyse',
  components: { splitPane },
  methods: {
    resize() {
      console.log('resize')
    }
  }
}
</script>

<style  scoped>
  .app-container {
    position: relative;
    height: 100vh;
  }

  .left-container {
    background-color: #F38181;
    height: 100%;
  }

  .right-container {
    background-color: #FCE38A;
    height: 100%;
  }

</style>
