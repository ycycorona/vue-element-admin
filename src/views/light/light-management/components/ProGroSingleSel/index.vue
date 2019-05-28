<template>
  <div>
    <el-tree
      ref="proGroTree"
      check-strictly
      :data="localTreeData"
      node-key="id"
      :props="defaultProps"
      :highlight-current="true"
      @current-change="nodeSelectChange"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'ProGroSingleSel',
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
      selectType: '', // 选择模式 gro 编组； pro 项目 notApproved 未通过审核智能灯
      selectedId: null // 选择的节点
    }
  },
  computed: {
    localTreeData() {
      const _treeData = deepClone(this.treeData)
      _treeData.unshift({
        id: 99999,
        name: '待审核智能灯',
        sub: [],
        notApproved: true
      })
      return _treeData
    }
  },
  watch: {

  },
  methods: {
    // 节点check回调
    nodeSelectChange(nodeData, nodeObj) {
      // 未审核智能灯
      if (nodeData.notApproved) {
        this.selectType = 'notApproved'
        this.selectedId = nodeData.id
        this.$emit('node-select-change', this.selectedId, this.selectType)
        return
      }
      this.selectType = nodeData.sub === undefined ? 'gro' : 'pro'
      this.selectedId = nodeData.id
      this.$emit('node-select-change', this.selectedId, this.selectType)
      // console.log(this.$refs['proGroTree'].setCurrentKey(null))
      // console.log(this.$refs['proGroTree'].getCurrentKey())
    }
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>

</style>
