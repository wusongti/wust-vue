<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'


  export default {
    name: 'App',
    created: function () {
      var xAuthToken = sessionStorage.getItem('x-auth-token');
      if (xAuthToken != undefined && xAuthToken != null && xAuthToken != ''){
        this.$router.push({path:'/Index'});
      }
    }
  }
</script>
<style>
  @import  'assets/css/common.css';
</style>
