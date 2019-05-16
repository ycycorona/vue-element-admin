<template>
  <div class="app-container">
    <split-pane split="vertical" :default-percent="15" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <pro-gro-selector :tree-data="projectGroupData" @node-check-change="nodeCheckChange" />
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <div class="filter-container form-filter">
            <el-form :inline="true" :model="form" size="small">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="form.duration"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
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
          <div class="charts-container" />
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import { getProjectGroup } from '@/api/light/common'
import { getOneP_GData, getMoreP_GData } from '@/api/light/energy-analyse'
import ProGroSelector from '@/components/light/ProGroSelector/index.vue'
export default {
  name: 'EnergyAnalyse',
  components: { splitPane, ProGroSelector },
  data() {
    return {
      form: {
        duration: ['', ''],
        dateType: 'day'
      },
      projectGroupData: [] // 项目编组选择树的数据
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
    testLogout() {
      this.$store.dispatch('user/logout')
    },
    // 项目编组check回调
    nodeCheckChange(checkMode, checkedList) {
      console.log(checkMode, checkedList)
      this.getChartsData(checkMode, checkedList)
    },
    getChartsData(checkMode, checkedList) {
      return new Promise((resolve, reject) => {
        // debugger
        const reqData = {
          type: this.form.dateType,
          startTime: this.form.duration[0],
          endTime: this.form.duration[1],
          projectId: [],
          groupId: []
        }

        let request = null
        const key = checkMode === 'pro' ? 'projectId' : 'groupId'
        if (checkedList.length === 0) {
          return
        } else if (checkedList.length === 1) {
          reqData[key].push(checkedList[0].id)
          request = getOneP_GData
        } else {
          reqData[key] = checkedList.map(ele => ele.id)
          request = getMoreP_GData
        }

        request(reqData)
          .then(res => {
            console.log(res)
            resolve(res)
          })
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
}
.form-filter {
  padding-left: 20px
}
</style>

<style lang="scss">
.el-date-editor .el-range-separator {
  width: 8%
}
</style>
