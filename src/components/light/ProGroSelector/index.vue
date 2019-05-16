<template>
  <div>
    <span>选择模式：</span>
    <el-switch
      v-model="checkMode"
      active-value="pro"
      active-text="按项目"
      inactive-value="gro"
      inactive-text="按编组"
      @change="switchChange"
    />
    <el-tree
      ref="proGroTree"
      check-strictly
      :data="checkMode === 'pro' ? treeDataByPro : treeDataByGro"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      @check="nodeCheckChange"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'ProGroSelector',
  props: {
    treeData: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'sub',
        label: 'name'
      },
      checkMode: 'gro', // 选择模式 gro 编组； pro 项目
      checkedNodeList: [] // 选择的节点
    }
  },
  computed: {
    // 按项目选择 树数据
    treeDataByPro() {
      if (Array.isArray(this.treeData) && this.treeData.length > 0) {
        const _treeData = deepClone(this.treeData)
        _treeData.forEach((ele) => {
          if (Array.isArray(ele.sub) && ele.sub.length > 0) {
            ele.sub.forEach((subEle) => {
              subEle.disabled = true
            })
          }
        })
        return _treeData
      } else {
        return []
      }
    },
    // 按编组选择 树数据
    treeDataByGro() {
      if (Array.isArray(this.treeData) && this.treeData.length > 0) {
        const _treeData = deepClone(this.treeData)
        _treeData.forEach((ele) => {
          ele.disabled = true
        })
        return _treeData
      } else {
        return []
      }
    }
  },
  watch: {

  },
  methods: {
    // 节点check回调
    nodeCheckChange(treeData, checked) {
      this.checkedNodeList = []
      // 克隆选择的节点
      // debugger
      checked.checkedNodes.forEach(({ id, name }) => {
        this.checkedNodeList.push({
          id, name
        })
      })
      this.$emit('node-check-change', this.checkMode, this.checkedNodeList)
    },
    // 根据key 获取节点
    // getNodeByKey(key) {
    //   return this.$refs['proGroTree'].getNode(key)
    // },
    // 选择模式改变
    switchChange(newVal) {
      // 清空已选择的节点
      this.checkedNodeList = []
    }
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>

</style>
