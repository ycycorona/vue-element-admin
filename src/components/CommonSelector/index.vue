<template>
  <el-form-item :label="label" :prop="prop" :label-width="labelWidth">
    <el-select v-model="input" :placeholder="placeholderText" :readonly="readonly" :disabled="disabled" :clearable="clearable" filterable @change="doChangeSelect">
      <el-option v-for="(item, n) in opts" :key="n" :label="item[labelField||'label']" :value="item[valField||'value']" />
    </el-select>
  </el-form-item>
</template>

<script>
import { deepClone } from '@/utils'
export default {
  name: 'CommonSelector',
  props: {
    label: {
      required: false,
      type: String,
      default: ''
    },
    labelWidth: {
      required: false,
      type: String,
      default: ''
    },
    apiKey: {
      required: false,
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      required: false,
      default: ''
    },
    placeholder: {
      required: false,
      type: String,
      default: ''
    },
    labelField: {
      required: false,
      type: String,
      default: ''
    },
    valField: {
      required: false,
      type: String,
      default: ''
    },
    disabled: {
      required: false,
      type: Boolean
    },
    prop: {
      required: false,
      type: String,
      default: ''
    },
    paramOpts: {
      required: false,
      type: Array,
      default: () => []
    },
    remoteDataHandler: {
      required: false,
      type: Function,
      default: () => ''
    },
    readonly: {
      required: false,
      type: Boolean,
      default: false
    },
    clearable: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      input: this.value,
      placeholderText: this.placeholder || '请选择',
      opts: []
    }
  },
  computed: {
    mapOpts() {
      const valKey = this.valField || 'value'
      const obj = {}
      this.opts.forEach((opt, index) => {
        obj[opt[valKey]] = opt
      })
      return obj
    }
  },
  watch: {
    value(n, o) { // 监听props传进来的value,单向改变组件内的input值
      this.input = n
    },
    paramOpts: {
      handler(n, o) { // 监听到opts改变 重新设置selector的opts
        this.opts = deepClone(this.paramOpts)
        this.input = ''
      },
      immediate: true
    }
  },
  created() {
    // this.getOpts()
  },
  methods: {
    doChangeSelect(v) {
      this.$emit('input', v)
      this.$emit('change', v)
      this.$emit('inputOptObj', this.mapOpts[v])
    }
  }
}
</script>
