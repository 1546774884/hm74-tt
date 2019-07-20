<template>
  <div class="img-container">
    <!-- 图片按钮 -->
    <div class="img-btn" @click="opendialog()">
      <img :src="value || tupian" />
    </div>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="700px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <div style="margin-bottom:10px">
            <el-radio-group v-model="reqFzimg.collect" size="small" @change="search()">
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 图片列表 -->
          <div class="img-item" :class="{xuanzhong:xzimageurl===item.url}" @click="xzimage(item.url)" v-for="item in images" :key="item.id">
            <img :src="item.url" alt />
          </div>

          <!-- 分页 -->
          <el-pagination
            v-if="total>reqFzimg.per_page"
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="reqFzimg.page"
            :page-size="reqFzimg.per_page"
            @current-change="pager"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="headers"
            name="image"
            :on-success="handleSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmimg()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入外部一张图片
import tupian from '../assets/images/default.png'

export default {
  name: 'fz-image',

  data () {
    return {
      // 获取素材列表时的传参
      reqFzimg: {
        collect: false,
        page: 1,
        per_page: 8
      },

      // 控制对话框显示隐藏
      dialogVisible: false,
      // 控制选中的选项卡
      activeName: 'image',

      // 上传图片后的预览地址
      imageUrl: null,

      // 上传图片的请求头
      headers: {
        Authorization: 'Bearer ' + JSON.parse(window.sessionStorage.getItem('hm74-toutiao')).token
      },

      // 上传图片的

      // 素材的列表
      images: [],

      // 总条数
      total: 0,

      // 定义一个选中的图片素材地址
      xzimageurl: null,

      // 点击确定后选中的图片
      // value: tupian
      tupian
    }
  },

  props: ['value'],

  methods: {
    opendialog () {
      this.dialogVisible = true
      // 做其他事情,渲染素材列表
      this.getImage()
      // 清除上一次的数据
      this.xzimageurl = null
      this.imageUrl = null
    },

    async getImage () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqFzimg })
      this.images = data.results
      this.total = data.total_count
    },

    search () {
      this.reqFzimg.page = 1
      this.getImage()
    },

    pager (newPage) {
      this.reqFzimg.page = newPage
      this.getImage()
    },

    // 上传成功
    handleSuccess (res) {
      // 预览
      this.imageUrl = res.data.url
    },

    // 选中图片
    xzimage (URL) {
      this.xzimageurl = URL
    },

    // 确认图片
    confirmimg () {
      if (this.activeName === 'image') {
        // 如果时素材，用xzimageurl
        if (!this.xzimageurl) return this.$message.warning('请选择素材')
        // this.value = this.xzimageurl
        this.$emit('input', this.xzimageurl)
      } else {
        // 如果是上传图片使用imageUrl
        if (!this.imageUrl) return this.$message.warning('请上传图片')
        // this.value = this.imageUrl
        this.$emit('input', this.imageUrl)
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style scope lang="less">
.img-btn {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.img-item {
  width: 150px;
  height: 120px;
  border: 1px dashed #ddd;
  margin-right: 10px;
  display: inline-block;
  position: relative;
  &.xuanzhong {
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2) url(../assets/images/selected.png) no-repeat
        center/ 50px 50px;
    }
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }

}
</style>
