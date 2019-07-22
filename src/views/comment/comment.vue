<template>
  <div class="comment-container">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 列表 -->
      <el-table :data="comments" style="width: 100%">
        <el-table-column label="标题" width="400" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                {{scope.row.comment_status? '正常':'关闭'}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
            <template slot-scope="scope">
                <el-button @click="toggleStatus(scope.row)" v-if="!scope.row.comment_status" type="success" size="mini">打开评论</el-button>
                <el-button @click="toggleStatus(scope.row)" v-else type="danger" size="mini">关闭评论</el-button>
            </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      style="margin-top:20px"
      background layout="prev, pager, next"
      :page-size="reqParams.per_page"
      :current-page="reqParams.page"
      @current-change="pager"
      :total="total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 评论信息
      comments: [],

      //   需要提交的参数
      reqParams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      },

      //   总条数
      total: 0
    }
  },

  created () {
    this.getcomment()
  },

  methods: {
    //   改变文章评论状态
    toggleStatus (ROW) {
      const text1 = '确认关闭吗？'
      const text2 = '确认打开吗？'
      this.$confirm(ROW.comment_status ? text2 : text1, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { data } } = await this.$http.put(`comments/status?article_id=` + ROW.id, { allow_comment: !ROW.comment_status })
        this.$message.success('修改成功！')
        // 把返回的状态值给ROW的状态值
        ROW.comment_status = data.allow_comment
      })
        .catch(() => {

        })
    },

    async getcomment () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      this.comments = data.results
      this.total = data.total_count
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getcomment()
    }
  }
}
</script>

<style scoped lang='less'>
</style>
