<template>
  <div>
    <svg-icon icon-class="edit" @click.stop="openSettingDialog"/>

    <el-dialog :visible.sync="settingDialogVisible" :append-to-body="true" title="Setting">
      <el-form ref="setting-form" :model="settingModel" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="固定header" label-width="140px">
          <el-switch v-model="headerBarFix"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SettingMenu',
  data() {
    return {
      settingDialogVisible: false,
      settingModel: {
        headerBarFix: null
      }
    }
  },
  computed: {
    headerBarFix: {
      get() {
        return this.$store.getters.headerBarFix
      },
      set() {
        this.$store.dispatch('toggleHeaderBarFix')
      }
    }
  },
  created() {

  },
  methods: {
    openSettingDialog() {
      this.settingDialogVisible = true
    }
  }
}
</script>

<style scoped>
/* .setting-menu-wrap {
  cursor: pointer;
  line-height: 50px;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  vertical-align: text-bottom;
} */
</style>
