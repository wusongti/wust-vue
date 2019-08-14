<template>
  <div>
    <el-tabs v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="组织架构">
        <el-container>
          <el-aside width="27%" style="border: 5px solid #eee;min-height: 400px;background-color: #eee">
            <el-form @submit.native.prevent>
              <el-input size="mini" @keyup.enter.native="onSearch">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form>
            <ul id="tree" class="ztree"></ul>
          </el-aside>
          <el-container>
            <el-header style="height: 35px;border-top:5px solid #eee;border-right:5px solid #eee;">
              <el-button-group style="margin-top: 1px;" class="pull-left">
                <el-button size="mini" @click="initUserOrganizationRelation" v-has-permission="'OrganizationList.initUserOrganizationRelation'"><span class="glyphicon glyphicon-plus" aria-hidden="true">初始化用户组织</span></el-button>
                <el-button size="mini"  v-bind:disabled="disableDeleteButton" @click="remove" v-has-permission="'OrganizationList.delete'"><span class="glyphicon glyphicon-remove" aria-hidden="true">移出组织</span></el-button>
                <el-button size="mini"  v-bind:disabled="disableSetFunctionPermissionsButton" @click="setFunctionPermissions" v-has-permission="'OrganizationList.setFunctionPermissions'"><span class="glyphicon glyphicon-setting" aria-hidden="true">设置功能权限</span></el-button>
                <el-button size="mini"  v-export-excel-directive="exportExcelPar" v-has-permission="'OrganizationList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></el-button>
                <el-dropdown size="mini" split-button trigger="click" @command="handleCommand">
                  添加组织
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-bind:disabled="disableAddAgentButton" command="AddAgent" v-has-permission="'OrganizationList.addCompany'">添加代理商</el-dropdown-item>
                    <el-dropdown-item v-bind:disabled="disableAddParentCompanyButton" command="AddParentCompany" v-has-permission="'OrganizationList.addCompany'">添加总公司</el-dropdown-item>
                    <el-dropdown-item v-bind:disabled="disableAddBranchCompanyButton" command="AddBranchCompany" v-has-permission="'OrganizationList.addCompany'">添加分公司</el-dropdown-item>
                    <el-dropdown-item v-bind:disabled="disableAddDepartmentButton" command="AddDepartment" v-has-permission="'OrganizationList.addDepartment'">添加部门</el-dropdown-item>
                    <el-dropdown-item v-bind:disabled="disableAddProjectButton" command="AddProject" v-has-permission="'OrganizationList.addProject'">添加项目</el-dropdown-item>
                    <el-dropdown-item v-bind:disabled="disableAddRoleButton" command="AddRole" v-has-permission="'OrganizationList.addRole'">添加角色</el-dropdown-item>
                    <el-dropdown-item v-bind:disabled="disableAddUserButton" command="AddUser" v-has-permission="'OrganizationList.addUser'">添加用户</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button-group>
            </el-header>
            <el-main style="border-bottom:5px solid #eee;border-right: 5px solid #eee;border-top:5px solid #eee;max-height: 400px">
              <div id="chart-container"></div>
            </el-main>
          </el-container>
        </el-container>
      </el-tab-pane>
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.key"
        :label="item.label"
        :name="item.name"
        closable>
        <company-add v-if="item.key == 'AddCompany'"  v-bind:selectedNode="selectedNode" v-on:addNode="addNode"></company-add>
        <department-add v-if="item.key == 'AddDepartment'"  v-bind:selectedNode="selectedNode" v-on:addNode="addNode"></department-add>
        <project-add v-if="item.key == 'AddProject'"  v-bind:selectedNode="selectedNode" v-on:addNode="addNode"></project-add>
        <role-add v-if="item.key == 'AddRole'" v-bind:selectedNode="selectedNode" v-on:addNode="addNode"></role-add>
        <user-add v-if="item.key == 'AddUser'" v-bind:selectedNode="selectedNode" v-on:addNode="addNode"></user-add>
        <function-tree v-if="item.key == 'SetFunctionPermissions'"  v-bind:selectedNode="selectedNode"></function-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import '../../../../../static/zTree_v3.5.27/js/jquery.ztree.core.js'
import '../../../../../static/zTree_v3.5.27/js/jquery.ztree.excheck.js'
import '../../../../../static/zTree_v3.5.27/js/jquery.ztree.exedit.js'
import '../../../../../static/orgchart/jquery.orgchart'
import CompanyAdd from './company-add'
import DepartmentAdd from './department-add'
import RoleAdd from './role-add'
import UserAdd from './user-add'
import FunctionTree from './function-tree'
import ProjectAdd from './project-add'

export default {
  name: 'OrganizationList',
  components: {
    ProjectAdd,
    FunctionTree,
    UserAdd,
    RoleAdd,
    DepartmentAdd,
    CompanyAdd
  },
  data () {
    return {
      setting: {
        view: {
          showLine: true,
          fontCss: function (treeId, treeNode) {
            return (treeNode.highlight) ? {color: '#A60000', 'font-weight': 'bold'} : {
              'font-weight': 'normal'
            }
          }
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeClick: (treeId, treeNode, clickFlag) => {
            this.switchButtonAvailableStatus(treeNode.type)

            this.selectedNode = treeNode
            this.searchModel.pid = treeNode.id
            this.searchModel.type = treeNode.type
          }
        }
      },
      searchModel: {
        id: '',
        pid: '-1',
        type: '',
        relationId: '',
        name: ''
      },
      disableAddAgentButton: true,
      disableAddParentCompanyButton: true,
      disableAddBranchCompanyButton: true,
      disableAddDepartmentButton: true,
      disableAddProjectButton: true,
      disableAddRoleButton: true,
      disableAddUserButton: true,
      disableDeleteButton: true,
      disableSetFunctionPermissionsButton: true,
      selectedNode: {id: '', pid: '-1', type: '', relationId: ''},
      searchHitZNodes: [],
      selectedModel: {
        type: ''
      },
      exportExcelPar: {
        fileType: 'xls',
        xmlName: 'admin_organization',
        moduleName: 'organization'
      },
      defaultActiveName: 'OrganizationList',
      editableTabsValue: 'OrganizationList',
      editableTabs: [],
      tabIndex: 2
    }
  },
  created: function () {
    this.buildTree()
  },
  methods: {
    clickNode: function (node) {
      // eslint-disable-next-line
      console.log(node)
    },
    buildTree: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/OrganizationController/buildTree',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          let zNodes = JSON.parse(res.data.obj.leftTree)

          // 初始化右树
          // eslint-disable-next-line no-undef
          $('#chart-container').orgchart({
            'data': JSON.parse(res.data.obj.rightTree),
            'nodeContent': 'title'
          })

          // eslint-disable-next-line no-undef
          let treeObj = $.fn.zTree.init($('#tree'), this.setting, zNodes)

          if (this.selectedNode != null && this.selectedNode.pid != null && this.selectedNode.id !== '') {
            this.expandParentNodes(this.selectedNode.children[0], treeObj)
            // eslint-disable-next-line no-undef
            $('#' + this.selectedNode.tId + '_a').click()
          } else {
            let nodes = treeObj.getNodes()
            if (nodes.length > 0) {
              // eslint-disable-next-line no-undef
              $('#tree_1_a').click()
            }
          }
        } else {
          if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        }
      })
    },

    // 树搜索
    onSearch: function ($even) {
      let searchKeyWord = $even.target.value
      if (!Vue.$isNullOrIsBlankOrIsUndefined(searchKeyWord)) {
        this.updateHitZNodesStyle(false)
        // eslint-disable-next-line no-undef
        let treeObj = $.fn.zTree.getZTreeObj('tree')
        this.searchHitZNodes = treeObj.getNodesByParamFuzzy('name', searchKeyWord)
        if (this.searchHitZNodes != null) {
          this.updateHitZNodesStyle(true)

          /**
               * 展开搜索到的节点
               */
          for (let i = 0; i < this.searchHitZNodes.length; i++) {
            this.expandParentNodes(this.searchHitZNodes[i], treeObj)
          }
        }
      }
    },

    // 展开父节点
    expandParentNodes: function (treeNode, treeObj) {
      let parentNode = treeNode.getParentNode()
      if (parentNode != null) {
        treeObj.expandNode(parentNode, true, true, true)
      }
    },

    // 更新命中节点样式
    updateHitZNodesStyle: function (highlight) {
      // eslint-disable-next-line no-undef
      let treeObj = $.fn.zTree.getZTreeObj('tree')
      let nodeLength = this.searchHitZNodes.length
      for (let i = 0; i < nodeLength; i++) {
        this.searchHitZNodes[i].highlight = highlight
        treeObj.updateNode(this.searchHitZNodes[i])
      }
    },

    /**
         * 切换按钮可用状态
         * @param type
         */
    switchButtonAvailableStatus: function (type) {
      if (type === '') { // 选中树的[根]节点，则启用添加公司和添加部门按钮
        this.disableAddAgentButton = false
        this.disableAddDepartmentButton = false

        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableDeleteButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
        this.disableSetFunctionPermissionsButton = true
      } else if (type === '101101') { // 选中树的[代理商]节点，则启用添加总公司和部门按钮
        this.disableAddParentCompanyButton = false
        this.disableAddDepartmentButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
        this.disableSetFunctionPermissionsButton = true
      } else if (type === '101104') { // 选中树的[总公司]节点，则启用添加分公司和部门按钮
        this.disableAddBranchCompanyButton = false
        this.disableAddDepartmentButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
        this.disableSetFunctionPermissionsButton = true
      } else if (type === '101107') { // 选中树的[分公司]节点，则启用添加部门和添加项目按钮
        this.disableAddDepartmentButton = false
        this.disableAddProjectButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
        this.disableSetFunctionPermissionsButton = true
      } else if (type === '101109') { // 选中树的[项目]节点，则启用添加部门按钮
        this.disableAddDepartmentButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
        this.disableSetFunctionPermissionsButton = true
      } else if (type === '101111') { // 选中树的部门点，则启用添加岗位按钮
        this.disableAddRoleButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddUserButton = true
        this.disableSetFunctionPermissionsButton = true
      } else if (type === '101113') { // 选中树的岗位节点，则启用添加用户按钮
        this.disableAddUserButton = false
        this.disableDeleteButton = false
        this.disableSetFunctionPermissionsButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddRoleButton = true
      } else if (type === '101115') { // 选中树的用户节点，则禁用所有按钮
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
        this.disableSetFunctionPermissionsButton = true
      }
    },
    initUserOrganizationRelation: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/SysUserOrganization/init'
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
        } else {
          if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        }
      })
    },
    handleCommand (command) {
      if (command === 'AddAgent') {
        this.addTab('添加代理商', 'AddAgent', 'AddCompany')
      } else if (command === 'AddParentCompany') {
        this.addTab('添加总公司', 'addParentCompany', 'AddCompany')
      } else if (command === 'AddBranchCompany') {
        this.addTab('添加分公司', 'AddBranchCompany', 'AddCompany')
      } else if (command === 'AddDepartment') {
        this.addTab('添加部门', 'AddDepartment', 'AddDepartment')
      } else if (command === 'AddProject') {
        this.addTab('添加项目', 'AddProject', 'AddProject')
      } else if (command === 'AddRole') {
        this.addTab('添加角色', 'AddRole', 'AddRole')
      } else if (command === 'AddUser') {
        this.addTab('添加用户', 'AddUser', 'AddUser')
      }
    },
    setFunctionPermissions: function () {
      this.addTab('设置功能权限', 'SetFunctionPermissions', 'SetFunctionPermissions')
      this.selectedModel = this.selectedNode
    },
    remove: function () {
      let that = this

      if (Vue.$isNullOrIsBlankOrIsUndefined(this.selectedNode) || Vue.$isNullOrIsBlankOrIsUndefined(this.selectedNode.id)) {
        this.$message({
          message: '请选择数据',
          type: 'warning'
        })
        return
      }

      this.$confirm('您确定删除该记录吗', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$adminServerURL + '/OrganizationController/delete/' + that.selectedNode.id
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
            this.removeNode()
          }
        })
      }).catch(() => {
      })
    },
    removeNode: function () {
      // eslint-disable-next-line no-undef
      let treeObj = $.fn.zTree.getZTreeObj('tree')

      treeObj.removeNode(this.selectedNode)
    },
    addNode: function (newNode) {
      console.dir(newNode)
      // eslint-disable-next-line no-undef
      let treeObj = $.fn.zTree.getZTreeObj('tree')
      treeObj.addNodes(this.selectedNode, newNode)
      this.removeTab(this.editableTabsValue)
    },
    addTab: function (label, name, key) {
      let ele = {label: label, name: name, key: key}
      let flag = false

      for (let i = 0; i < this.editableTabs.length; i++) {
        let var1 = this.editableTabs[i]
        if (var1.key === key) {
          flag = true
          break
        }
      }

      if (!flag) {
        this.editableTabs.push(ele)
      }
      this.editableTabsValue = name
    },
    removeTab: function (targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            } else {
              activeName = this.defaultActiveName
              // eslint-disable-next-line no-undef
              $('#' + this.selectedNode.tId + '_a').click()
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    clickTab: function (tab) {
      if (tab.name === this.defaultActiveName) {
        // eslint-disable-next-line no-undef
        $('#' + this.selectedNode.tId + '_a').click()
      }
    }
  }
}
</script>
<style>
  @import '../../../../../static/zTree_v3.5.27/css/zTreeStyle.css';
  @import '../../../../../static/orgchart/jquery.orgchart.css';
</style>
