/**
* Created by WST on 2019/5/16.
*/
<template>
  <el-form ref="updateModel" :model="updateModel" :rules="rules" label-width="100px">
    <el-form-item label="部门编码">
      <el-input
        v-model="updateModel.code"
        :disabled="true">
      </el-input>
    </el-form-item>
    <el-form-item label="部门名" prop="name">
      <el-input v-model="updateModel.name"></el-input>
    </el-form-item>
    <el-form-item label="部门负责人">
      <el-input v-model="updateModel.leader"></el-input>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="updateModel.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('updateModel')">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'DepartmentUpdate',
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
      },
      rules: {
        name: [{required: true, message: '请输入部门名称', trigger: 'blur'}]
      }
    }
  },
  created: function () {
    this.updateModel = this.selectedModel
  },
  methods: {
    onSubmit: function (formData) {
      this.$refs[formData].validate((valid) => {
        if (!valid) {
        } else {
          Vue.$ajax({
            method: 'post',
            url: Vue.$adminServerURL + '/DepartmentController/update',
            data: this.updateModel
          }).then(res => {
            if (res.data.flag !== 'SUCCESS') {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
              this.resetForm('updateModel')
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
