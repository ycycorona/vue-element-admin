<template>
  <div>
    <el-dialog
      title="打印"
      :visible.sync="dialogVisible"
      :fullscreen="true"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { deepClone } from '@/utils'

export default {
  name: 'PrintDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  methods: {
    handleClose() {

    }
  }
}
</script>

<style>
</style>

<style lang="scss" scoped>
</style>
