/**
* Created by WST on 2019/5/24.
*/
<template>
  <div id="role-import">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>导入角色</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <file-upload-component :src="uploadUrl" :fileType="'xls,xlsx'" :fileSize="10" v-on:importCallback="importCallback"></file-upload-component>
          </form>
        </div>
        <div class="submit-group">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import FileUploadComponent from '../../../common/component/file-upload-component.vue'
export default {
  name: 'RoleImport',
  components: {
    FileUploadComponent
  },
  data () {
    return {
      uploadUrl: Vue.$adminServerURL + '/RoleController/importByExcel?moduleName=role'
    }
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopover', false)
    },
    importCallback: function (e) { // 回调
      this.closePopover()
      this.$router.push({path: '/MyImportExportList'})
    }
  }
}
</script>
<style>
  @import "../../../assets/css/my-popover.css";
</style>
