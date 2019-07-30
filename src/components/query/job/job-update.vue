/**
* Created by WST on 2019/6/13.
*/
<template>
  <el-form ref="updateModel" :model="updateModel" :rules="rules" label-width="200px">
    <el-form-item label="作业名" prop="jobName">
      <el-input v-model="updateModel.jobName" :disabled="true">
      </el-input>
    </el-form-item>
    <el-form-item label="作业全限定类名称" prop="jobClassName">
      <el-input v-model="updateModel.jobClassName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="作业分组" prop="jobGroupName">
      <el-input v-model="updateModel.jobGroupName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="Cron表达式" prop="cronExpression">
      <el-input v-model="updateModel.cronExpression"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('updateModel')">提交</el-button>
    </el-form-item>
  </el-form>
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
      },
      rules: {
        jobName: [{required: true, message: '请输入作业名', trigger: 'blur'}],
        jobClassName: [{required: true, message: '请输入作业全限定类名称', trigger: 'blur'}],
        jobGroupName: [{required: true, message: '请输入作业分组', trigger: 'blur'}],
        cronExpression: [{required: true, message: '请输入Cron表达式', trigger: 'blur'}]
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
    onSubmit: function (formData) {
      this.$refs[formData].validate((valid) => {
        if (!valid) {
        } else {
          Vue.$ajax({
            method: 'post',
            url: Vue.$adminServerURL + '/JobController/update',
            data: this.updateModel
          }).then(res => {
            if (res.data.flag !== 'SUCCESS') {
              if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
                this.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            } else {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
            }
          })
        }
      })
    }
  }
}
</script>
