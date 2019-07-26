/**
* Created by WST on 2019/5/16.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <el-form ref="updateModel" :model="updateModel" :rules="rules" label-width="100px">
    <el-form-item label="登录账号" prop="loginName">
      <el-input v-model="updateModel.loginName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="真实姓名" prop="realName">
      <el-input v-model="updateModel.realName"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="updateModel.email"></el-input>
    </el-form-item>
    <el-form-item label="性别">
      <select class="form-control" v-data-dictionary-directive:1003="updateModel.sex"  v-model="updateModel.sex">
      </select>
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model="updateModel.mobile"></el-input>
    </el-form-item>
    <el-form-item label="用户类型">
      <select class="form-control" v-data-dictionary-directive:1004="updateModel.type" v-model="updateModel.type">
      </select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('updateModel')">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'UserUpdate',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        id: '',
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
            url: Vue.$adminServerURL + '/UserController/update',
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
            }
          })
        }
      })
    }
  }
}
</script>
