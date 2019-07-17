/**
* Created by WST on 2019/5/16.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div id="role-update">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>更新角色</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">编码</label>
              </div>
              <div class="form-group col-xs-6">
                {{updateModel.code}}
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputName" class="required">角色名</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" id="inputName" placeholder="角色名" v-model="updateModel.name">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">状态</label>
              </div>
              <div class="form-group col-xs-6">
                <select class="form-control" v-data-dictionary-directive:1002="updateModel.status" v-model="updateModel.status">
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputDescription">描述</label>
              </div>
              <div class="form-group col-xs-6">
                <textarea class="form-control" rows="3" id="inputDescription" v-model="updateModel.description"></textarea>
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
  name: 'RoleUpdate',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        id: '',
        code: '',
        name: '',
        description: '',
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
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.name)) {
        this.$message({
          message: '请输入角色名',
          type: 'success'
        })
        return
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.status)) {
        this.$message({
          message: '请输入角色名',
          type: 'success'
        })
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/RoleController/update',
        data: this.updateModel
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
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
