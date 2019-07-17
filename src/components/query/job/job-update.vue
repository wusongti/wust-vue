/**
* Created by WST on 2019/6/13.
*/
<template>
  <div id="job-update">
    <div class="my-popover">
      <div class="my-popover-box" style="width: 40%">
        <div class="my-popover-title">
          <label>更新作业</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="form-group col-xs-10">
                <label>作业名</label>
                <input type="text" class="form-control"  v-model="updateModel.jobName" readonly/>
              </div>
              <div class="form-group col-xs-10">
                <label>作业全限定类名称</label>
                <input type="text" class="form-control"  v-model="updateModel.jobClassName" readonly/>
              </div>
              <div class="form-group col-xs-10">
                <label>作业分组</label>
                <input type="text" class="form-control"  v-model="updateModel.jobGroupName" readonly/>
              </div>
              <div class="form-group col-xs-10">
                <label class="required">Cron表达式</label>
                <input type="text" class="form-control" placeholder="表达式" v-model="updateModel.cronExpression"/>
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
  name: 'JobUpdate',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        jobName: '',
        jobClassName: '',
        jobGroupName: '',
        cronExpression: ''
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
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.cronExpression)) {
        this.$message({
          message: '请输入表达式',
          type: 'warning'
        })
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$autotaskServerURL + '/JobController/update',
        data: this.updateModel
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message({
            message: res.data.message,
            type: 'warning'
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
