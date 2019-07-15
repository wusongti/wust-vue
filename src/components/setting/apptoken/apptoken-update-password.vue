/**
* Created by WST on 2019/5/16.
*/
<template>
  <div id="apptoken-update-password">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>更新外部应用账号密码</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">应用标识</label>
              </div>
              <div class="form-group col-xs-6">
                {{updateModel.appId}}
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">账号</label>
              </div>
              <div class="form-group col-xs-6">
                {{updateModel.loginName}}
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">密码</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control"  placeholder="密码" v-model="updateModel.password">
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
  name: 'ApptokenUpdatePassword',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        id: '',
        appId: '',
        loginName: '',
        password: ''
      }
    }
  },
  created: function () {
    this.updateModel = this.selectedModel
    this.updateModel.password = ''
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopver', false)
    },
    doUpdate: function () {
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.password)) {
        this.$message('warning', '请输入密码', 3000)
        return
      }

      if (!Vue.$isPassword(this.updateModel.password)) {
        this.$message('warning', '合法的密码格式为：字母、数字、下划线或三者组成的字符', 3000)
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/AppTokenController/update',
        data: this.updateModel
      }).then(res => {
        if (res.data.flag != 'SUCCESS') {
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
