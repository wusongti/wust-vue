/**
* Created by WST on 2019/5/14.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <el-form ref="addModel" :model="addModel" :rules="rules" label-width="100px" @submit.prevent>
    <el-form-item label="登录账号" prop="loginName">
      <el-input v-model="addModel.loginName"></el-input>
    </el-form-item>
    <el-form-item label="真实姓名" prop="realName">
      <el-input v-model="addModel.realName"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="addModel.email"></el-input>
    </el-form-item>
    <el-form-item label="性别">
      <select class="form-control" v-data-dictionary-directive:1003  v-model="addModel.sex">
      </select>
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model="addModel.mobile"></el-input>
    </el-form-item>
    <el-form-item label="用户类型">
      <select class="form-control" v-data-dictionary-directive:1004 v-model="addModel.type">
      </select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('addModel')">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'UserCreate',
  data () {
    return {
      addModel: {
        loginName: '',
        realName: '',
        sex: '',
        email: '',
        type: '',
        mobile: '',
        status: ''
      },
      rules: {
        loginName: [{required: true, message: '请输入登录账号', trigger: 'blur'}],
        realName: [{required: true, message: '请输入真实姓名', trigger: 'blur'}]
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
            url: Vue.$adminServerURL + '/UserController/create',
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
