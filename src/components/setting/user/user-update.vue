/**
* Created by WST on 2019/5/16.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div id="user-update">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>更新用户</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">登录账号</label>
              </div>
              <div class="form-group col-xs-3">
                {{updateModel.loginName}}
              </div>
              <div class="col-xs-2 text-right">
                <label for="inputRealName" class="required">真实姓名</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="inputRealName" placeholder="真实姓名" v-model="updateModel.realName">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputEmail">邮箱</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="email" class="form-control" id="inputEmail" placeholder="邮箱" v-model="updateModel.email">
              </div>
              <div class="col-xs-2 text-right">
                <label class="required">性别</label>
              </div>
              <div class="form-group col-xs-3">
                <select class="form-control" v-data-dictionary-directive:1003="updateModel.sex"  v-model="updateModel.sex">
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputMobile">联系电话</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="inputMobile" placeholder="联系电话" v-model="updateModel.mobile">
              </div>
              <div class="col-xs-2 text-right">
                <label class="required">用户类型</label>
              </div>
              <div class="form-group col-xs-3">
                <select class="form-control" v-data-dictionary-directive:1004="updateModel.type" v-model="updateModel.type">
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">状态</label>
              </div>
              <div class="form-group col-xs-3">
                <select class="form-control" v-data-dictionary-directive:1002="updateModel.status" v-model="updateModel.status">
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="submit-group">
          <button class="btn btn-danger btn-sm" @click="closePopover">取消</button>
          <button class="btn btn-primary btn-sm" @click="doUpdate">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'UserUpdate',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        id: '',
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
  created: function () {
    this.updateModel = this.selectedModel
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopover', false)
    },
    doUpdate: function () {
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.realName)) {
        this.$message('warning', '请输入真实姓名', 3000)
        return
      }

      if (!Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.email)) {
        if (!Vue.$isEmail(this.userAddModel.email)) {
          this.$message('warning', '请输入正确的邮箱', 3000)
          return
        }
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.sex)) {
        this.$message('warning', '请选择性别', 3000)
        return
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.type)) {
        this.$message('warning', '请选择用户类型', 3000)
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/UserController/update',
        data: this.updateModel
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message('warning', res.data.message, 3000)
        } else {
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
