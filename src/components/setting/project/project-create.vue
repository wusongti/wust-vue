/**
* Created by WST on 2019/5/14.
*/
<template>
  <el-form ref="addModel" :model="addModel" :rules="rules" label-width="100px">
    <el-form-item label="项目名" prop="name">
      <el-input v-model="addModel.name"></el-input>
    </el-form-item>
    <el-form-item label="项目地址">
      <el-input v-model="addModel.addr"></el-input>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="addModel.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('addModel')">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'ProjectCreate',
  data () {
    return {
      addModel: {
        name: '',
        addr: '',
        description: ''
      },
      rules: {
        name: [{required: true, message: '请输入项目名称', trigger: 'blur'}]
      }
    }
  },
  methods: {
    onSubmit: function (formData) {
      this.$refs[formData].validate((valid) => {
        if (!valid) {
        } else {
          Vue.$ajax({
            method: 'post',
            url: Vue.$adminServerURL + '/ProjectController/create',
            data: this.addModel
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
              this.resetForm('addModel')
            }
          })
        }
      })
    },
    resetForm (formData) {
      this.$refs[formData].resetFields()
    }
  }
}
</script>
