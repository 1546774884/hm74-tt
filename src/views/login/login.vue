<template>
  <div class="login-container">
    <el-card shadow="hover" class="login-box">
      <img src="../../assets/images/logo_index.png" alt />

      <el-form ref="LoginForm" :model="LoginForm" :rules="loginRules" :status-icon="true">
        <el-form-item prop="mobile">
          <el-input v-model="LoginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="LoginForm.code" placeholder="请输入验证码" style="width:240px"></el-input>
          <el-button type="primary" style="float:right">发送验证码</el-button>
        </el-form-item>
        <el-checkbox v-model="checked">
          我已阅读并同意
          <span style="color:#ccc">用户协议</span>和
          <span style="color:#ccc">隐私条款</span>
        </el-checkbox>
      </el-form>
      <el-button type="primary" style="display:block;margin:0 auto;margin-top:30px" @click='login'>登录</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      this.$refs.LoginForm.validate((val) => {
        if (val) {
          this.$http
            .post('http://ttapi.research.itcast.cn/mp/v1_0/authorizations', this.LoginForm)
            .then((res) => {
              window.sessionStorage.setItem('hm74-toutiao', JSON.stringify(res.data.data))
              this.$router.push('/')
            }).catch(() => {
              this.$message.error('手机或验证码错误！')
            })
        }
      })
    }
  },

  data () {
    var checkMobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机格式不正确!'))
      }
    }

    var checkCode = (rule, value, callback) => {
      if (/\d{6}/.test(value)) {
        callback()
      } else {
        callback(new Error('验证码格式不正确!'))
      }
    }

    return {
      checked: true,
      LoginForm: {
        mobile: '',
        code: ''
      },
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang='less'>
.login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url(../../assets/images/login_bg.jpg) no-repeat center/cover;

  .login-box {
    width: 400px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      display: block;
      width: 200px;
      margin: 0 auto;
    }
  }
}
</style>
