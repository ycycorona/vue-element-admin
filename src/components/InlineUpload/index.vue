<template>
  <el-upload
    ref="el-upload-com"
    action="123"
    class="inline-upload"
    size="medium"
    :disabled="uploadComDisable"
    :http-request="doUpload"
    name="file"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="onFileChange"
    :on-exceed="onExceed"
    :accept="accept"
    :limit="limit"
  > <!--文件数限制-->
    <el-input v-model="perUploadFileName" readonly style="width: 200px" @click.native.stop />
    <el-button type="primary" @click.native="selectPerUploadFile">选择文件</el-button>
    <!--<el-button type="danger" v-else @click.native.stop="cancelPerUploadFile">删除文件</el-button>-->
    <div v-if="fileExplain" slot="tip" class="el-upload__tip" style="line-height: 25px;margin-top: 0; ">{{ fileExplain }}</div>
    <!--只能上传.xls/.xlsx扩展名文件-->
  </el-upload>
</template>

<script>
export default {
  name: 'InlineUpload',
  props: {
    hasFile: {
      type: Boolean,
      required: true
    },
    accept: {
      type: String,
      required: false,
      default: '*/*'
    },
    limit: {
      type: Number,
      required: true
    },
    fileExplain: {
      type: String,
      required: false,
      default: ''
    },
    maxSize: {
      type: Number, // 字节数
      required: false,
      default: 0
    }
  },
  data() {
    return {
      uploadComDisable: false, // 是否禁用上传插件
      perUploadFileName: '',
      comFileList: [], // 组件当前载入的文件列表
      currentFileNum: 0
    }
  },
  methods: {
    onExceed(file, fileList) {
      console.log('exceed')
      this.$emit('exceed')
    },
    onFileChange(file, fileList) {
      console.log(fileList)
      this.currentFileNum = fileList.length
      this.perUploadFileName = fileList.length > 0 ? (fileList[fileList.length - 1].name || '') : ''
      if (fileList && fileList.length > 0) {
        if (this.maxSize && (file.size > this.maxSize)) { // 文件大小限制
          this.cancelPerUploadFile()
          this.$emit('update:hasFile', false)
          this.$emit('pushFile', [])
          this.$message.error(`文件大小超过${this.maxSize}字节限制`)
        } else {
          this.$emit('update:hasFile', true)
          this.$emit('pushFile', fileList)
        }
      } else {
        this.$emit('update:hasFile', false) // 与父组件同步是否有文件的状态
        this.$emit('pushFile', [])
      }
    },
    selectPerUploadFile() { // 如果数量超限，先清除文件，后冒泡给组件触发选择
      if (this.currentFileNum >= this.limit && this.limit === 1) {
        this.cancelPerUploadFile()
      }
    },
    cancelPerUploadFile() { // 删除预上传文件 ，没有使用el-upload删除上传文件的方法
      this.$refs['el-upload-com'].clearFiles() // 清理文件列表
      this.onFileChange(null, [])
    },
    submit() {
      this.$refs['el-upload-com'].submit()
    },
    doUpload(r) {
      console.log(r)
    }
  }
}
</script>

<style scoped>

</style>
