<template>
  <div id="div-login">
    <el-container>
      <el-header style="height: 40px">
        <el-col id="logo">
          <img src="../../assets/logo.png" class="pull-left"/>
          <a href="javascript:">XXX<span class="lite">智慧社区云平台</span></a>
        </el-col>
      </el-header>
      <el-main>
        <el-form class="login-form">
          <div class="login-wrap">
            <p class="login-img"><i class="icon_lock_alt"></i></p>
            <div class="input-group">
              <span class="input-group-addon"><i class="icon_profile"></i></span>
              <input type="text" class="form-control" placeholder="Username" autofocus v-model="loginName">
            </div>
            <div class="input-group">
              <span class="input-group-addon"><i class="icon_key_alt"></i></span>
              <input type="password" class="form-control" placeholder="Password" v-model="password">
            </div>
            <button class="btn btn-primary btn-lg btn-block" type="button" @click="login" v-text="$t('components.login.login.label3')"></button>
          </div>
        </el-form>
      </el-main>
      <el-footer style="height: 25px">
        XXX科技公司&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备案号
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'Login',
  data () {
    return {
      loginName: '',
      password: ''
    }
  },
  created: function () {
    let that = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key === 13) {
        that.login()
      }
    }
  },
  methods: {
    login: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$baseURL + '/api-sso-server/LoginController/login',
        data: {
          'loginName': this.loginName,
          'password': this.password
        }
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          this.loginContext.setLoginContext(res)
          this.$router.push({path: '/Index'})
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style>
  @import "../../assets/css/elegant-icons-style.css";
  @import "login.css";
</style>
