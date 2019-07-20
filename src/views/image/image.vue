<template>
  <div
    class="container"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div>
        <!-- 按钮收藏和全部 -->
        <el-radio-group v-model="reqimgcan.collect" size="small" @change="search()">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 绿色按钮 -->
        <el-button
          type="success"
          style="float:right"
          size="small"
          @click="dialogVisible = true"
        >上传素材</el-button>
      </div>

      <!-- 图片列表 -->
      <ul class="img-list">
        <li v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="footer" v-if="!reqimgcan.collect">
            <span class="el-icon-star-off" @click="toggle(item)" :class="{red:item.is_collected}"></span>
            <span class="el-icon-delete" @click="delImg(item.id)"></span>
          </div>
        </li>
      </ul>

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqimgcan.per_page"
        :current-page="reqimgcan.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <!-- 上传框 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        name="image"
        :headers="headers"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reqimgcan: {
        collect: false,
        page: 1,
        per_page: 10
      },

      //   图片素材
      images: [],

      // 加载loading
      loading: false,

      //   总条数
      total: 0,

      //   添加素材的相关数据
      dialogVisible: false,
      imageUrl: null,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(window.sessionStorage.getItem('hm74-toutiao')).token
      }
    }
  },

  created () {
    // 获取素材列表数据
    this.getImages()
  },

  methods: {
    search () {
      this.getImages()
    },

    async getImages () {
      // 发送请求前
      this.loading = true
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqimgcan })
      // 获取数据给images
      this.images = data.results
      // 获取总条数
      this.total = data.total_count
      this.per_page = data.per_page
      //   获取数据后
      this.loading = false
    },

    // 分页
    pager (newPage) {
      this.reqimgcan.page = newPage
      this.getImages()
    },

    // 上传成功后的钩子函数
    handleAvatarSuccess (res) {
      this.imageUrl = res.data.url // 返回的图片给框框
      this.$message.success('成功啦，啊哈哈哈')
      // 放个定时器
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages() // 更新列表
        this.imageUrl = null
      }, 2000)
    },

    // 切换收藏和取消收藏
    async toggle (item) {
      const { data: { data } } = await this.$http.put('user/images/' + item.id, { collect: !item.is_collected })
      // 成功后
      this.$message.success('操作成功啦')
      // 把当前图片状态改为后台给的状态
      item.is_collected = data.collect
    },

    // 删除图片
    delImg (ID) {
      this.$confirm('哦哈哈哈此操作将永久删除该图片, 是否继续?', '沙雕提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete('user/images/' + ID)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getImages()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.img-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  li {
    position: relative;
    width: 160px;
    height: 160px;
    border: 1px dashed #ddd;
    float: left;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .footer {
      width: 100%;
      height: 30px;
      position: absolute;
      left: 0;
      bottom: 0;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
