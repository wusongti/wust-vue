/**
* Created by WST on 2019/5/14.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <el-form ref="addModel" :model="addModel" :rules="rules" label-width="100px" @submit.prevent>
    <el-form-item label="公司名" prop="name">
      <el-input v-model="addModel.name"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <select class="form-control" v-data-dictionary-directive:1011 v-model="addModel.type">
      </select>
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
  name: 'CompanyCreate',
  data () {
    return {
      addModel: {
        name: '',
        type: '',
        description: ''
      },
      rules: {
        name: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
        type: [{required: true, message: '请选择类型', trigger: 'blur'}]
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
            url: Vue.$adminServerURL + '/CompanyController/create',
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
