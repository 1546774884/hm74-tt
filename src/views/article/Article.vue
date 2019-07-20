<template>
<div class="artical-container">
    <!-- 筛选区域 -->
<el-card>
   <div slot="header">
  <mianbx>内容管理</mianbx>
   </div>
    <!-- 筛选表单 -->
     <el-form :model="reqCan" label-width="80px" size="small">
        <el-form-item label="状态:">
             <el-radio-group v-model="reqCan.status">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">待审核</el-radio>
                <el-radio :label="2">审核通过</el-radio>
                <el-radio :label="3">审核失败</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="频道:">
          <pindao v-model="reqCan.channel_id"></pindao>
        </el-form-item>

        <el-form-item label="日期:">
          <el-date-picker
          value-format="yyyy-MM-dd"
          @change="changeData"
            v-model="dataValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">筛选</el-button>
        </el-form-item>
     </el-form >
</el-card>

<!-- 结果区域 -->
<el-card>
  <div slot="header">
    根据筛选条件共查询到<b>{{total}}</b>条结果：
  </div>

  <el-table
      :data="articles"
      style="width: 100%">
      <el-table-column
        prop=""
        label="封面"
        width="180">
        <template slot-scope="scope">
          <el-image :src="scope.row.cover.images[0]" style="width:100px;height:75px">
            <div slot="error" class="image-slot">
            <img src="../../assets/images/error.gif" width="100" height="75">
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop=""
        label="状态">
        <template slot-scope="scope">
          {{scope.row.id}}
            <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status === 4" type="danger">已删除</el-tag>

        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发布时间">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row.id)" type="primary" plain icon="el-icon-edit" circle></el-button>
            <el-button @click="del(scope.row.id)" type="danger" plain icon="el-icon-delete" circle></el-button>
          </template>
      </el-table-column>
    </el-table>

   <div class="box">
      <el-pagination background layout="prev, pager, next" @current-change="pager" :page-size="reqCan.per_page" :current-page="reqCan.page" :total="total">
    </el-pagination>
   </div>

</el-card>
</div>

</template>

<script>
// // 引入面包屑组件
// import mianbx from '@/components/mianbx.vue'
// 引入pindao.vue组件
import pindao from '@/components/pindao.vue'

export default {

  // 注册pindao组件
  components: {
    pindao
  },

  // // 注册面包蟹
  // components: {
  //   mianbx
  // },
  data () {
    return {
      // 提交的筛选数据
      reqCan: {
        page: 1,
        per_page: 20,
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },

      // 日期数据
      dataValue: [],

      // 文章列表数据
      articles: [],

      // 总条数
      total: 0

    }
  },

  created () {
    // 获取文章列表数据
    this.getarticles()
  },

  methods: {
    // 选择时间处理函数
    changeData (value) {
      this.reqCan.begin_pubdate = value[0]
      this.reqCan.end_pubdate = value[1]
    },

    // 获取文件列表数据
    async getarticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqCan })
      console.log(data.results)
      this.articles = data.results
      this.total = data.total_count
    },

    // 搜索
    search () {
      this.reqCan.page = 1
      console.log(this.reqCan)
      console.log(this.dataValue)
      this.getarticles()
    },

    // 分页
    pager (newpage) {
      this.reqCan.page = newpage
      this.getarticles()
    },

    // 删除
    del (id) {
      this.$confirm('哈哈此操作将永久删除该文章, 是否继续?', '沙雕提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`articles/${id}`)
        // 删除成功
        this.$message.success('删除成功')
        this.getarticles()
      }).catch(() => {

      })
    },

    // 编辑
    edit (id) {
      this.$router.push(`/publish?id=${id}`)
    }
  }
}

</script>

<style scoped lang='less'>
    .el-card {
        margin-bottom:20px;
    }
    .box {
      text-align: center;
      margin-top: 20px
    }
</style>
