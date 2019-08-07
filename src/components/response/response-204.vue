<template>
  <div class="page-204">
    <p class="text-204">204</p>
    <h2>登录信息过期</h2>
    <p>您的登录信息已经过期，请重新登录，{{timing}}秒后自动跳转到登录页面 <br><a href="#" v-on:click="toLogin">现在就去登录</a></p>
  </div>
</template>
<script>
export default {
  name: '204',
  data () {
    return {
      timing: 5
    }
  },
  created: function () {
    this.init()
  },
  methods: {
    init: function () {
      let that = this
      let intervalId = setInterval(function () {
        if (that.timing === 0) {
          window.clearInterval(intervalId)
          that.toLogin()
        }
        that.timing--
      }, 1000)
    },
    toLogin: function () {
      this.loginContext.removeLoginContext()
      this.$router.push({path: '/Login'})
    }
  }
}
</script>
<style>
  @import "response.css";
</style>
