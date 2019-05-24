<template>
  <div class="filter-container form-filter">
    <el-form :inline="false" :model="form" size="small" class="form" label-width="120px">
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
          <el-form-item label="智能灯编号">
            <el-input v-model="form.lightNumber" placeholder="智能灯编号" class="normal-width-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外壳编号">
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
          <el-form-item label="I额定功率/W">
            <el-input v-model="form.beforeGonglv" placeholder="I额定功率/W" class="normal-width-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="II额定功率/W">
            <el-input v-model="form.currentGonglv" placeholder="II额定功率/W" class="normal-width-input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-form-item label="MAC地址">
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
        <el-form-item label="校表码">
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
        <el-form-item label="扩展PANID">
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
          <el-form-item label="频道(11-26)">
            <el-input v-model="form.pindao" placeholder="请输入" class="normal-width-input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="I路旧灯功率/W">
            <el-input v-model="form.oldkw" placeholder="请输入" class="normal-width-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="II路旧灯功率/W">
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
            <span>经度：</span><span>{{ lat }}</span>
            <span>纬度：</span><span>{{ lng }}</span>
          </el-form-item>
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
import { getInfoFromGatewayId, getLightType } from '@/api/light/light-management'
export default {
  name: 'AddLightPop',
  components: {
    CommonSelector
  },
  props: {
    projectGroupLightData: {
      type: Array,
      required: false,
      default: () => []
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
  created() {
    this.doGetLightType()
  },
  methods: {
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
    // 获取路灯类型
    doGetLightType() {
      getLightType()
        .then(response => {
          this.lightTypeOpts = response
        })
    },
    onMacInput(obj, key) {
      const valStr = String(obj[key]).trim()
      if (!/^\d{1,3}$/.test(valStr)) {
        if (Number(valStr) && Number(valStr) > 255) {
          obj[key] = 255
        } else {
          obj[key] = 0
        }
      } else {
        obj[key] = Number(valStr)
      }
    },
    onFocusSelect(ref) {
      this.$refs[ref][0].select()
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
</style>
