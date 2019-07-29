/**
* Created by WST on 2019/6/11.
*/
<template>
  <el-form ref="updateModel" :model="updateModel"  label-width="100px">
    <el-form-item label="">
      <el-radio-group v-model="updateModel.type">
        <el-radio label="100905">只有本人可见</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="">
      <el-radio-group v-model="updateModel.type">
        <el-radio label="100910">同一岗位可见</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="">
      <el-radio-group v-model="updateModel.type">
        <el-radio label="100915">同一部门可见</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="">
      <el-radio-group v-model="updateModel.type">
        <el-radio label="100920">同一公司可见</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('updateModel')">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'DataPrivilegeRulesUpdate',
  props: ['selectedModel'],
  data () {
    return {
      typeRadio: '',
      updateModel: {dataPrivilegeId: ''}
    }
  },
  created: function () {
    this.updateModel = this.selectedModel
  },
  methods: {
    onSubmit: function (formData) {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataPrivilegeRulesController/update/' + this.updateModel.dataPrivilegeId + '/' + this.updateModel.type
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
  }
}
</script>
