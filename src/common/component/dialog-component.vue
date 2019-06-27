/**
* Created by WST on 2019/5/17.
*/
<template>
  <div id="myDialog">
    <div class="dialog dialog-center" v-if="showDialog">
     <div class="dialog_title">{{title}}</div>
      <div class="dialog_container">
        <div class="dialog_content">
          <div class="dialog_content_top">{{message}}</div>
          <div class="dialog_btn">
            <button class="btn btn-danger btn-sm" @click="cancel" v-if="showCancelButton">取消</button>
            &nbsp;
            &nbsp;
            &nbsp;
            <button class="btn btn-primary btn-sm" @click="ok" v-if="showOKButton">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  export default {
    name: 'myDialog',
    data(){
      return {
        title:'',         // 标题
        message:'',       // 消息内容
        showDialog:false,
        showOKButton:false,
        showCancelButton:true,
        fnOK:null,       // 确定函数
        fnCancel:null,   // 取消函数
      }
    },
    methods:{
      ok:function () {
        this.close();
        this.fnOK();
      },
      cancel:function () {
        this.close();
        this.fnCancel();
      },
      close:function () {
        this.showDialog = false;
      }
    }
  }
</script>
<style>
  .dialog{
    position: fixed;
    z-index: 100000;
    border: solid 1px #337ab7;
  }

  .dialog-center {
    top: 28%;
    left: 50%;
    transform: translate(-50%, -50%)
  }

  .dialog_title{
    background: #337ab7;
    color: #fff;
  }
  .dialog_container{
    background: #fff;
    width: 300px;
    height: 120px;
    position: relative;
    /*border-radius: 10px;*/
    margin: 0 auto;
  }
  .dialog_content{
    text-align: center;
    padding-top: 25px;
  }
  .dialog_btn{
    margin-top: 20px;
  }
</style>
