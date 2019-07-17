/**
* Created by WST on 2019/6/13.
*/
<template>
  <div id="job-create">
    <div class="my-popover">
      <div class="my-popover-box" style="width: 40%">
        <div class="my-popover-title">
          <label>新建作业</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="form-group col-xs-10">
                <label class="required">作业名称</label>
                <input type="text" class="form-control" placeholder="作业名称" v-model="addModel.jobName"/>
              </div>
              <div class="form-group col-xs-10">
                <label class="required">作业全限定类名称：如com.wust.springcloud.autotask.server.job.HelloJob</label>
                <input type="text" class="form-control" placeholder="作业全限定类名称" v-model="addModel.jobClassName"/>
              </div>
              <div class="form-group col-xs-10">
                <label class="required">作业分组</label>
                <input type="text" class="form-control" placeholder="作业分组" v-model="addModel.jobGroupName"/>
              </div>
              <div class="form-group col-xs-10">
                <label class="required">Cron表达式</label>
                <input type="text" class="form-control" placeholder="表达式" v-model="addModel.cronExpression"/>
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
  name: 'JobCreate',
  data () {
    return {
      addModel: {
        jobName: '',
        jobClassName: '',
        jobGroupName: '',
        cronExpression: ''
      }
    }
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopover', false)
    },
    doAdd: function () {
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.jobName)) {
        this.$message({
          message: '请输入作业名称',
          type: 'warning'
        })
        return
      }
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.jobClassName)) {
        this.$message({
          message: '请输入作业全限定类名称',
          type: 'warning'
        })
        return
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.jobGroupName)) {
        this.$message({
          message: '请输入作业分组',
          type: 'warning'
        })
        return
      }

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.cronExpression)) {
        this.$message({
          message: '请输入表达式',
          type: 'warning'
        })
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$autotaskServerURL + '/JobController/create',
        data: this.addModel
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
