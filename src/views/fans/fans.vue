<template>
  <div class="fans-container">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fans-item" v-for="item in fans" :key="item.id">
            <el-avatar :size="80" :src="item.photo"></el-avatar>
            <p style="font-size:12px">{{item.name}}</p>
            <el-button plain type="primary" size="mini">+关注</el-button>
          </div>

          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000"
            :page-size="reqfans.per_page"
            :current-page="reqfans.page"
            @current-change="pager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="huaxiang">
          <div ref="bar" style="width:600px; height:400px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'huaxiang',
      fans: [],
      reqfans: {
        page: 1,
        per_page: 20
      },
      total: 0
    }
  },

  created () {
    this.getfans()
  },

  mounted () {
    this.drawChart()
  },

  methods: {
    drawChart () {
      const dom = this.$refs.bar
      const myEcharts = echarts.init(dom)
      //   什么图表参考什么对应的配置
      const option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }
      myEcharts.setOption(option)
    },

    pager (newPage) {
      this.reqfans.page = newPage
      this.getfans()
    },

    async getfans () {
      const {
        data: { data }
      } = await this.$http.get('followers')
      this.fans = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style scope lang="less">
.fans-item {
  text-align: center;
  width: 120px;
  height: 160px;
  border: 1px dashed #ddd;
  padding: 20px;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
