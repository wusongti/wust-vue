<template>
  <div>
    <div class="login-img3-body">
      <div class="container">
        <form class="login-form">
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

            <button class="btn btn-primary btn-lg btn-block" type="button" @click="login">Login</button>
            <!--
                <button class="btn btn-info btn-lg btn-block" type="submit">Signup</button>
                -->
          </div>
        </form>
        <div style="margin-top:150px;text-align: right">
          <div class="credits">
            Designed by <a href="9080.iteye.com">Wust</a>
          </div>
        </div>
      </div>
    </div>
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
          this.$message('info', res.data.message, 3000)
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
