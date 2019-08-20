<template>
  <div class="page-undone">
    <p class="text-undone">undone</p>
    <h2>尚未开放！</h2>
    <p>您请求的资源尚未开发！ <br/><a href="#" @click="$goBack()">立即返回</a></p>
  </div>
</template>
<script>
export default {
  name: 'undone',
  data () {
  }
}
</script>
<style>
  @import "response.css";
</style>
