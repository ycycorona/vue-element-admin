<template>
  <div class="filter-container form-filter">
    <el-form ref="form" :rules="formRules" :inline="false" :model="form" size="small" class="form" label-width="120px">
      <el-row>
        <el-col :span="12">
          <common-selector
            v-model="form.projectId"
            label="项目名称"
            :param-opts="projectGroupLightData"
            label-field="name"
            val-field="id"
            prop="projectId"
            @inputOptObj="projectIdChange"
          />
        </el-col>
        <el-col :span="12">
          <common-selector
            v-model="form.groupId"
            label="编组名称"
            :param-opts="lightGroupIdOpts"
            label-field="name"
            val-field="id"
            prop="groupId"
            @inputOptObj="lightGroupIdChange"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="智能灯编号" prop="lightNumber">
            <el-input v-model="form.lightNumber" placeholder="智能灯编号" class="normal-width-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外壳编号" prop="shellNumber">
            <el-input v-model="form.shellNumber" placeholder="外壳编号" class="normal-width-input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="智能灯版本">
            <span>{{ banben_add }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <common-selector
            v-model="form.typeId"
            label="智能灯类型"
            :param-opts="lightTypeOpts"
            label-field="name"
            val-field="id"
            prop="typeId"
          />
        </el-col>
        <el-col :span="12">
          <common-selector
            v-model="form.anzhuang"
            label="安装状态"
            :param-opts="operateStatusOpts"
            label-field="name"
            val-field="id"
            prop="anzhuang"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="I额定功率/W" prop="beforeGonglv">
            <el-input v-model="form.beforeGonglv" placeholder="I额定功率/W" class="normal-width-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="II额定功率/W" prop="currentGonglv">
            <el-input v-model="form.currentGonglv" placeholder="II额定功率/W" class="normal-width-input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-form-item label="MAC地址" prop="macList">
          <el-input
            v-for="n in 8"
            :ref="`mac-input-${n}`"
            :key="n"
            v-model="form.macList[n-1]"
            size="medium"
            class="mini-width-input"
            @input="onMacInput(form.macList, n-1)"
            @focus="onFocusSelect(`mac-input-${n}`)"
          />
        </el-form-item>
      </el-row>
      <el-row :span="24">
        <el-form-item label="校表码" prop="jiaobiaomaList">
          <el-input
            v-for="n in 12"
            :key="n"
            :ref="`jiaobiaoma-input-${n}`"
            v-model="form.jiaobiaomaList[n-1]"
            size="medium"
            class="mini-width-input"
            @input="onMacInput(form.jiaobiaomaList, n-1)"
            @focus="onFocusSelect(`jiaobiaoma-input-${n}`)"
          />
        </el-form-item>
      </el-row>
      <el-row :span="24">
        <el-form-item label="扩展PANID" prop="panidList">
          <el-input
            v-for="n in 8"
            :ref="`panid-input-${n}`"
            :key="n"
            v-model="form.panidList[n-1]"
            size="medium"
            class="mini-width-input"
            @input="onMacInput(form.panidList, n-1)"
            @focus="onFocusSelect(`panid-input-${n}`)"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="频道(11-26)" prop="pindao">
            <el-input v-model="form.pindao" placeholder="请输入" class="normal-width-input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="I路旧灯功率/W" prop="oldkw">
            <el-input v-model="form.oldkw" placeholder="请输入" class="normal-width-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="II路旧灯功率/W" prop="oldkw2">
            <el-input v-model="form.oldkw2" placeholder="请输入" class="normal-width-input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <common-selector
            v-model="form.fangxiang"
            label="安装方向"
            :param-opts="directOpts"
            label-field="name"
            val-field="id"
            prop="fangxiang"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="智能灯位置">
            <span class="bold-text">经度：</span><span class="padding-right">{{ lat }}</span>
            <span class="bold-text">纬度：</span><span>{{ lng }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="map-canvas-light-wrap">
            <light-location-map
              v-if="lat && lng"
              :lng="lng"
              :lat="lat"
              :is-draggable="true"
              @drag-position="onDragPosition"
            />
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
const operateStatusOpts = [{ id: 1, name: '使用两路' }, { id: 2, name: '使用主路' }, { id: 3, name: '使用辅路' }]
const directOpts = [{ id: 0, name: '左侧主路' }, { id: 1, name: '右侧主路' }]

import { deepClone } from '@/utils'
import CommonSelector from '@/components/CommonSelector'
import LightLocationMap from '../LightLocationMap'
import { getInfoFromGatewayId, getLightType } from '@/api/light/light-management'
import Promise from 'lie'
export default {
  name: 'EditLightPop',
  components: {
    CommonSelector, LightLocationMap
  },
  props: {
    projectGroupLightData: {
      type: Array,
      required: false,
      default: () => []
    },
    detailData: {
      type: Object,
      required: false,
      default: () => null
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    function getArray(num, initVal) {
      return Array.from(new Array(num), () => initVal)
    }
    return {
      form: {
        lightNumber: '',
        shellNumber: '',
        projectId: '',
        groupId: '',
        typeId: '',
        anzhuang: '',
        macList: getArray(8, 0),
        jiaobiaomaList: getArray(12, 0),
        panidList: getArray(8, 0),
        beforeGonglv: '',
        currentGonglv: '',
        pindao: '',
        oldkw: '',
        oldkw2: '',
        fangxiang: ''
      },
      formRules: {
        projectId: [
          { required: true, message: '请选择项目名称' }
        ],
        groupId: [
          { required: true, message: '请选择编组名称' }
        ],
        shellNumber: [
          { required: true, message: '请输入外壳编号' }
        ],
        lightNumber: [
          { required: true, message: '请输入智能灯编号' }
        ],
        typeId: [
          { required: true, message: '请选择智能灯类型' }
        ],
        anzhuang: [
          { required: true, message: '请选择安装状态' }
        ],
        beforeGonglv: [
          { required: true, message: '请输入I额定功率/W' }
        ],
        currentGonglv: [
          { required: true, message: '请输入I额定功率/W' }
        ],
        pindao: [
          { required: true, message: '请输入pindao' }
        ],
        oldkw: [
          { required: true, message: '请输入I路旧灯功率/W' }
        ],
        oldkw2: [
          { required: true, message: '请输入II路旧灯功率/W' }
        ],
        fangxiang: [
          { required: true, message: '请选择安装方向' }
        ]
      },
      lightGroupIdOpts: [],
      lat: '',
      lng: '',
      banben_add: '',
      gatewayId: '',
      lightTypeOpts: [],
      operateStatusOpts: operateStatusOpts,
      directOpts: directOpts
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    await this.doGetLightType()
    this.setData()
    if (this.readonly) {
      // set readonly
    }
  },
  methods: {
    // 回显数据
    setData() {
      if (this.detailData) {
        // const detail = this.detailData
        // const form = this.form
        // form.projectId = detail.
      }
    },
    getAddLightParams() {
      let obj
      this.$refs['form'].validate((vaild) => {
        if (vaild) {
          const form = this.form
          obj = {
            projectId: form.projectId,
            groupId: form.groupId,
            gatewayId: this.gatewayId,
            lightNumber: form.lightNumber,
            shellNumber: form.shellNumber,
            typeId: form.typeId,
            banben: this.banben_add,
            anzhuang: form.anzhuang,
            mac: form.macList.join(','),
            jiaobiaoma: form.jiaobiaomaList.join(','),
            pindao: form.pindao,
            panid: form.panidList.join(','),
            oldkw: form.oldkw,
            oldkw2: form.oldkw2,
            fangxiang: form.fangxiang,
            lat: this.lat,
            lng: this.lng,
            beforeGonglv: form.beforeGonglv,
            currentGonglv: form.currentGonglv
          }
        } else {
          console.log('unvalid')
        }
      })

      return obj
    },
    // 验证表单数据
    doValidate() {
      this.$refs['form'].validate((vaild) => {
        if (vaild) {
        // 提交数据
        }
      })
    },
    // 项目id改变
    projectIdChange(obj) {
      this.lightGroupIdOpts = deepClone(obj.sub)
    },
    lightGroupIdChange(obj) {
      // 获取编组定位
      getInfoFromGatewayId(obj.id)
        .then(response => {
          this.gatewayId = response.id
          this.banben_add = response.banben
          this.lat = response.lat
          this.lng = response.lng
        })
    },
    // 获取智能灯类型
    doGetLightType() {
      return new Promise((resolve, reject) => {
        getLightType()
          .then(response => {
            this.lightTypeOpts = response
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // mac地址input自动更正
    onMacInput(obj, key) {
      console.log(obj[key])
      const valStr = String(obj[key]).trim()
      const valNum = Number(valStr)
      if (/^\d{1,3}$/.test(valStr)) {
        if (valNum && valNum > 255) {
          obj[key] = 255
        } else if (valNum && valNum < 0) {
          obj[key] = 0
        } else {
          obj[key] = valNum
        }
      } else {
        obj[key] = 0
      }
    },
    // 获取焦点回调
    onFocusSelect(ref) {
      this.$refs[ref][0].select()
    },
    // 地图选点回调
    onDragPosition({ lat, lng }) {
      this.lat = lat
      this.lng = lng
    }
  }
}
</script>

<style>
.mini-width-input .el-input__inner {
  padding: 0 5px;
}
</style>

<style lang="scss" scoped>
.normal-width-input {
  width: 200px
}
.mini-width-input {
  width: 50px;
  margin-right: 5px;

}
.bold-text {
  font-weight: 700
}
.padding-right {
  padding-right: 10px
}
</style>
