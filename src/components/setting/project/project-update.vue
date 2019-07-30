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
    <el-form-item label="项目名" prop="name">
      <el-input v-model="updateModel.name"></el-input>
    </el-form-item>
    <el-form-item label="项目地址">
      <el-input v-model="updateModel.addr"></el-input>
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
  name: 'ProjectUpdate',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        id: '',
        code: '',
        name: '',
        addr: '',
        description: ''
      },
      rules: {
        name: [{required: true, message: '请输入项目名称', trigger: 'blur'}]
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
            url: Vue.$adminServerURL + '/ProjectController/update',
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
