/**
* Created by WST on 2019/5/14.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div id="user-create">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>新建用户</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputLoginName" class="required">登录账号</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="inputLoginName" placeholder="登录账号" v-model="addModel.loginName"/>
              </div>
              <div class="col-xs-2 text-right">
                <label for="inputRealName" class="required">真实姓名</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="inputRealName" placeholder="真实姓名" v-model="addModel.realName">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputEmail">邮箱</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="email" class="form-control" id="inputEmail" placeholder="邮箱" v-model="addModel.email">
              </div>
              <div class="col-xs-2 text-right">
                <label>性别</label>
              </div>
              <div class="form-group col-xs-3">
                <select class="form-control" v-data-dictionary-directive:1003  v-model="addModel.sex">
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputMobile">联系电话</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="inputMobile" placeholder="联系电话" v-model="addModel.mobile">
              </div>
              <div class="col-xs-2 text-right">
                <label class="required">用户类型</label>
              </div>
              <div class="form-group col-xs-3">
                <select class="form-control" v-data-dictionary-directive:1004 v-model="addModel.type">
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="submit-group">
          <button class="btn btn-danger btn-sm" @click="closePopover">取消</button>
          <button class="btn btn-primary btn-sm" @click="doAdd">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'UserCreate',
  data () {
    return {
      addModel: {
        loginName: '',
        realName: '',
        sex: '',
        email: '',
        type: '',
        mobile: '',
        status: ''
      }
    }
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopover', false)
    },
    doAdd: function () {
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.loginName)) {
        this.$message({
          message: '请输入登录账号',
          type: 'warning'
        })
        return
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.realName)) {
        this.$message({
          message: '请输入真实姓名',
          type: 'warning'
        })
        return
      }

      if (!Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.email)) {
        if (!Vue.$isEmail(this.addModel.email)) {
          this.$message({
            message: '请输入正确的邮箱',
            type: 'warning'
          })
          return
        }
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.type)) {
        this.$message({
          message: '请选择用户类型',
          type: 'warning'
        })
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/UserController/create',
        data: this.addModel
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        } else {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.closePopover()
        }
      })
    }
  }
}
</script>
<style>
  @import "../../../assets/css/my-popover.css";
</style>
