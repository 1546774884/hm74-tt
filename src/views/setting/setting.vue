<template>
  <div class="setting-container">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form :model="userForm" label-width="120px">
            <el-form-item label="编号:">{{userForm.id}}</el-form-item>
            <el-form-item label="手机:">{{userForm.mobile}}</el-form-item>
            <el-form-item label="媒体名称:">
              <el-input v-model="userForm.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:">
              <el-input type="textarea" :rows="4" v-model="userForm.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传图片 -->
          <!-- name是上传文件的字段名 -->
          <el-upload
            :http-request="myUpload"
            class="avatar-uploader"
            :show-file-list="false"
            action=""
            name="photo"
          >
            <img v-if="userForm.photo" :src="userForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 导入eventbus
import eventbus from '@/eventbus/eventBus.js'

export default {
  data () {
    return {
      userForm: {
        id: null,
        name: null,
        mobile: null,
        intro: null,
        email: null,
        photo: null
      }
      //
      // imageUrl: ''
    }
  },

  created () {
    //   获取用户信息
    this.getUserInfo()
  },

  methods: {
    myUpload (data) {
      // 现在     自己来上传图片，使用axios配合formData进行图片上传
      const formdata = new FormData()
      formdata.append('photo', data.file)
      this.$http.patch('user/photo', formdata).then(res => {
        // console.log(res)
        // 此时的res是响应对象，是包含响应主体的，所以是res.data.data
        // 提示信息
        this.$message.success('修改头像成功')
        // 修改自己组件的头像
        this.userForm.photo = res.data.data.photo
        console.log(this.userForm.photo)
        // 1.更新修改home的头像
        eventbus.$emit('updateHeaderPhoto', res.data.data.photo)
        // 2.更新本地sessionstrong里的数据
        const xx = JSON.parse(window.sessionStorage.getItem('hm74-toutiao'))

        xx.photo = res.data.data.photo
        window.sessionStorage.setItem('hm74-toutiao', JSON.stringify(xx))
      })
    },

    //   保存修改用户信息
    async updateUserInfo () {
      const {
        data: { data }
      } = await this.$http.patch('user/profile', {
        name: this.userForm.name,
        intro: this.userForm.intro,
        emile: this.userForm.email
      })
      //   提示成功信息
      this.$message.success('哈哈哈修改成功！')
      //   1.传当前后台返回的数据给home组件实时显示修改数据 用户名称
      eventbus.$emit('updateHeaderName', data.name)
      //   2.更新本地存储的用户名称
      const xx = JSON.parse(window.sessionStorage.getItem('hm74-toutiao'))

      xx.name = data.name
      window.sessionStorage.setItem('hm74-toutiao', JSON.stringify(xx))
    },

    async getUserInfo () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userForm = data
    }
  }
}
</script>

<style>
</style>
