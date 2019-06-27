<template>
  <div class="page-error">
    <p class="text-error">Error</p>
    <h2>错误！</h2>
    <p>系统错误，请联系管理员！{{timing}}秒后自动返回 <br><a href="#" v-on:click="$goBack()">立即返回</a></p>
  </div>
</template>
<script>
  export default {
    name:'error',
    data(){
      return{
        timing:5
      }
    },
    created: function () {
      var that = this;
      var intervalId = setInterval(function () {
        if(that.timing == 0){
          window.clearInterval(intervalId);
          that.$goBack()
        }
        that.timing --;
      },1000);
    }
  }
</script>
<style>
  @import "response.css";
</style>
