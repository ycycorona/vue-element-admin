<template>
  <div class="app-container">
    <split-pane split="vertical" :default-percent="15" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <pro-gro-selector
            :tree-data="projectGroupData"
          />
        </div>
      </template>
      <template slot="paneR">
        <button type="button" @click="testLogout">
          test logout
        </button>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import { getProjectGroup } from '@/api/light/common'
import ProGroSelector from '@/components/light/ProGroSelector/index.vue'
export default {
  name: 'EnergyAnalyse',
  components: { splitPane, ProGroSelector },
  data() {
    return {
      projectGroupData: []
    }
  },
  created() {
    this.doGetProjectGroup()
  },
  methods: {
    resize() {
      // console.log("resize");
    },
    doGetProjectGroup() {
      return new Promise((resolve, reject) => {
        getProjectGroup().then(response => {
          this.projectGroupData = response
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    testLogout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style  scoped>
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
  background-color: #fce38a;
  height: 100%;
}
</style>
