/**
* Created by WST on 2019/6/5.
*/
<template>
  <div id="apptoken-create">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>新建外部应用访问账号</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">应用标识</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="应用标识" v-model="addModel.appId"/>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">账号</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="账号" v-model="addModel.loginName"/>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">密码</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="密码" v-model="addModel.password"/>
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
  name: 'ApptokenCreate',
  data () {
    return {
      addModel: {
        appId: '',
        loginName: '',
        password: ''
      }
    }
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopver', false)
    },
    doAdd: function () {
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.appId)) {
        this.$message('warning', '请输入应用标识', 3000)
        return
      }
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.loginName)) {
        this.$message('warning', '请输入账号', 3000)
        return
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.password)) {
        this.$message('warning', '请输入密码', 3000)
        return
      }

      if (!Vue.$isPassword(this.addModel.password)) {
        this.$message('warning', '合法的密码格式为：字母、数字、下划线或三者组成的字符', 3000)
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/AppTokenController/create',
        data: this.addModel
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
