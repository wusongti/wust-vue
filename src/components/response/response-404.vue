<template>
  <div class="page-404">
    <p class="text-404">404</p>
    <h2>找不到资源！</h2>
    <p>您请求的资源不存在！{{timing}}秒后自动返回 <br/><a href="#" @click="$goBack()">立即返回</a></p>
  </div>
</template>
<script>
  import Vue from 'vue';

  export default {
    name:'404',
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
          that.$goBack();
        }
        that.timing --;
      },1000);
    }
  }
</script>
<style>
  @import "response.css";
</style>
