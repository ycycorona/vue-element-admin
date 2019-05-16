<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      @check="nodeCheckChange"
    />
  </div>
</template>

<script>
// import { addClass, removeClass } from '@/utils'

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
      }
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    nodeCheckChange(treeData, checkStatusObj) {
      console.log(treeData, checkStatusObj)
    }
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>

</style>
