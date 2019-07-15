/**
* Created by WST on 2019/5/16.
*/
<template>
  <div id="company-update">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>更新公司</label>
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
                <label class="required">公司名</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control"  placeholder="公司名" v-model="updateModel.name">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label>父级公司</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="父公司" v-model="updateModel.pname">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label>公司负责人</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="公司负责人" v-model="updateModel.leader">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label>描述</label>
              </div>
              <div class="form-group col-xs-6">
                <textarea class="form-control" rows="3" v-model="updateModel.description"></textarea>
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
  name: 'CompanyUpdate',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        id: '',
        code: '',
        pcode: '',
        name: '',
        pname: '',
        leader: '',
        description: ''
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
        this.$message('warning', '请输入公司名', 3000)
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/CompanyController/update',
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
