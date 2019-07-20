<template>
     <el-select :value="value" placeholder="所有频道" @change="fn">
        <el-option
            v-for="item in pdOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        ></el-option>
    </el-select>
</template>

<script>
export default {
  props: ['value'],
  name: 'my-pindao',
  data () {
    return {
      pdOption: []
    }
  },

  created () {
    this.getpdoption()
  },

  methods: {
    fn (value) {
      //   value是你选中的值
      // 用到子传父
      this.$emit('input', value)
    },

    // 获取频道数据
    async getpdoption () {
      // 结构赋值
      const { data: { data } } = await this.$http.get('channels')
      this.pdOption = data.channels
    }

  }
}
</script>

<style>

</style>
