/**
* Created by WST on 2019/5/14.
*/
<template>
  <div id="function-tree">
    <el-form label-width="100px">
      <div class="text-left">
        <label style="color: red;font-size: small;margin-left: 8px;">当前角色：{{selectedModel.name}}</label>
        <ul id="functionTree" class="ztree"></ul>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()" size="mini">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.core.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.excheck.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.exedit.js'

export default {
  name: 'FunctionTree',
  components: {
    PaginationComponent
  },
  props: ['selectedModel', 'selectedNode'],
  data () {
    return {
      setting: {
        view: {
          showLine: true
        },
        check: {
          enable: true,
          chkboxType: {'Y': 'ps', 'N': 's'}

        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeClick: (treeId, treeNode, clickFlag) => {

          }
        }
      }

    }
  },
  created: function () {
    this.initData()
  },
  methods: {
    initData: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/OrganizationController/findFunctionTreeByRoleId/' + this.selectedNode.id + '/' + this.selectedModel.id
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          let zNodes = JSON.parse(res.data.obj)
          // eslint-disable-next-line no-undef
          $.fn.zTree.init($('#functionTree'), this.setting, zNodes)
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    closePopover: function () {
      this.$emit('closePopver', false)
    },
    onSubmit: function () {
      // eslint-disable-next-line no-undef
      let treeObj = $.fn.zTree.getZTreeObj('functionTree')
      let nodes = treeObj.getCheckedNodes(true)
      if (nodes == null || nodes.length === 0) {
        this.$message({
          message: '请选择功能权限数据',
          type: 'warning'
        })
        return
      }

      let sysRoleResourceAdd = {pId: this.selectedNode.id, roleId: this.selectedModel.id, organizationId: '', sysRoleResources: []}
      let sysRoleResources = []
      if (nodes != null && nodes.length > 0) {
        for (let i = 0; i < nodes.length; i++) {
          let rr = {resourceId: nodes[i]['id'], type: nodes[i]['type']}
          sysRoleResources[i] = rr
        }

        sysRoleResourceAdd.sysRoleResources = sysRoleResources
        Vue.$ajax({
          method: 'post',
          url: Vue.$adminServerURL + '/OrganizationController/setFunctionPermissions',
          data: sysRoleResourceAdd
        }).then(res => {
          if (res.data.flag === 'SUCCESS') {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>
<style>
  @import '../../../../static/zTree_v3.5.27/css/zTreeStyle.css';

  #functionTree{
    width:100%;
    height:100%;
  }

</style>
