<template>
  <div class="page-401">
    <p class="text-401">401</p>
    <h2>没有权限</h2>
    <p>您没有权限访问此部分功能，请联系管理员，{{timing}}秒后自动返回 <br><a href="#" v-on:click="$goBack()">立即返回</a></p>
  </div>
</template>
<script>
export default {
  name: '401',
  data () {
    return {
      timing: 5
    }
  },
  created: function () {
    var that = this
    var intervalId = setInterval(function () {
      if (that.timing == 0) {
        window.clearInterval(intervalId)
        that.$goBack()
      }
      that.timing--
    }, 1000)
  }
}
</script>
<style>
  @import "response.css";
</style>
