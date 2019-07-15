<template>
  <div class="page-undone">
    <p class="text-undone">undone</p>
    <h2>尚未开放！</h2>
    <p>您请求的资源尚未开发！{{timing}}秒后自动返回 <br/><a href="#" @click="$goBack()">立即返回</a></p>
  </div>
</template>
<script>
export default {
  name: 'undone',
  data () {
    return {
      timing: 5
    }
  },
  created: function () {
    var that = this
    var intervalId = setInterval(function () {
      if (that.timing === 0) {
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
