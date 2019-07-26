/**
* Created by WST on 2019/5/16.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <el-form ref="updateModel" :model="updateModel" :rules="rules" label-width="100px">
    <el-form-item label="编码">
      <el-input  v-model="updateModel.code" :disabled="true">
      </el-input>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="updateModel.name"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <select class="form-control" v-data-dictionary-directive:1002="updateModel.status" v-model="updateModel.status">
      </select>
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
  name: 'RoleUpdate',
  props: ['selectedModel'],
  data () {
    return {
      updateModel: {
        id: '',
        code: '',
        name: '',
        description: '',
        status: ''
      },
      rules: {
        name: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
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
            url: Vue.$adminServerURL + '/RoleController/update',
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
