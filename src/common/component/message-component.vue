/**
* Created by WST on 2019/5/16.
*/
<template>
  <div id="alert">
    <div class="alert alert-success alert-dismissible dialog-tips dialog-center" role="alert" v-if="messageType == 'success'">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="close"><span aria-hidden="true">&times;</span></button>
      <strong>成功!</strong> {{message}}
    </div>
    <div class="alert alert-info alert-dismissible dialog-tips dialog-center" role="alert" v-if="messageType == 'info'">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="close"><span aria-hidden="true">&times;</span></button>
      <strong>提示!</strong> {{message}}
    </div>
    <div class="alert alert-warning alert-dismissible dialog-tips dialog-center" role="alert" v-if="messageType == 'warning'">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="close"><span aria-hidden="true">&times;</span></button>
      <strong>警告!</strong> {{message}}
    </div>
    <div class="alert alert-danger alert-dismissible dialog-tips dialog-center" role="alert" v-if="messageType == 'danger'">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="close"><span aria-hidden="true">&times;</span></button>
      <strong>危险!</strong> {{message}}
    </div>
  </div>
</template>
<script>
  export default {
    name: 'message',
    data(){
        return {
            messageType:'',
            message:""
        }
    },
    methods:{
        close:function () {
          this.messageType = '';
        }
    }
  }
</script>
<style>
  .dialog-tips {
    position: fixed;
    z-index: 100000; /*这个层级必须要比response-xxx页面里面的层级少，否则弹出消息会在异常响应页面出来后继续弹出消息，很不友好*/
  }

  .dialog-center {
    top: 18.5%;
    left: 50%;
    transform: translate(-50%, -50%)
  }
</style>
