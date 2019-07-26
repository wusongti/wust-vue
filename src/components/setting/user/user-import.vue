/**
* Created by WST on 2019/5/24.
*/
<template>
  <el-form  label-width="100px">
    <file-upload-component :src="uploadUrl" :fileType="'xls,xlsx'" :fileSize="10" v-on:importCallback="importCallback"></file-upload-component>
  </el-form>
</template>
<script>
import Vue from 'vue'
import FileUploadComponent from '../../../common/component/file-upload-component.vue'
export default {
  name: 'UserImport',
  components: {
    FileUploadComponent
  },
  data () {
    return {
      uploadUrl: Vue.$adminServerURL + '/UserController/importByExcel?moduleName=user'
    }
  },
  methods: {
    importCallback: function (e) { // 回调
      this.$router.push({path: '/MyImportExportList'})
    }
  }
}
</script>
