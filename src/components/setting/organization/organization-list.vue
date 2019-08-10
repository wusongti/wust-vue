<template>
  <div>
    <el-tabs v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="组织架构">
        <el-container>
          <el-aside width="250px" style="height: 75vh;border: 1px solid #eee">
            <el-form @submit.native.prevent>
              <el-input size="mini" @keyup.enter.native="onSearch">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form>
            <span style="color: red;font-size: 12px;text-align: left">当前选中：{{this.selectedNode.name}}</span>
            <ul id="tree" class="ztree"></ul>
          </el-aside>
          <el-main style="border-bottom:1px solid #eee;border-right: 1px solid #eee;border-top:1px solid #eee;">
            <div class="panel-body progress-panel">
              <div class="row">
                <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
                  <button type="button" class="btn btn-default" @click="initUserOrganizationRelation" v-has-permission="'OrganizationList.initUserOrganizationRelation'"><span class="glyphicon glyphicon-plus" aria-hidden="true">初始化用户组织关系</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddAgentButton" @click="addAgent" v-has-permission="'OrganizationList.addCompany'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加代理商</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddParentCompanyButton" @click="addParentCompany" v-has-permission="'OrganizationList.addCompany'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加总公司</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddBranchCompanyButton" @click="addBranchCompany" v-has-permission="'OrganizationList.addCompany'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加分公司</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddDepartmentButton" @click="addDepartment" v-has-permission="'OrganizationList.addDepartment'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加部门</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddProjectButton" @click="addProject" v-has-permission="'OrganizationList.addProject'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加项目</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddRoleButton" @click="addRole" v-has-permission="'OrganizationList.addRole'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加角色</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddUserButton" @click="addUser" v-has-permission="'OrganizationList.addUser'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加用户</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableDeleteButton" @click="remove" v-has-permission="'OrganizationList.delete'"><span class="glyphicon glyphicon-remove" aria-hidden="true">移出组织</span></button>
                  <button type="button" class="btn btn-default" v-export-excel-directive="exportExcelPar" v-has-permission="'OrganizationList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></button>
                </div>
              </div>
            </div>
            <!-- 公司列表 -->
            <table class="table table-hover table-bordered" v-if="companyList != null && companyList.length > 0">
              <thead>
              <tr>
                <th>公司编码</th>
                <th>公司名称</th>
                <th>公司描述</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in companyList">
                <td>{{data.code}}</td>
                <td>
                  {{data.name}}
                </td>
                <td>
                  {{data.description}}
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="8">
                  <pagination-component v-bind:currentPage="searchModel.pageDto.currentPage"
                                        v-bind:showCount="searchModel.pageDto.showCount"
                                        v-bind:totalResult="baseDto.page.totalResult"
                                        v-on:updatePageIndex="pageIndexChange"
                                        @pageClick="listPage"></pagination-component>
                </td>
              </tr>
              </tfoot>
            </table>
            <!-- 部门列表 -->
            <table class="table table-hover table-bordered" v-if="departmentList != null && departmentList.length > 0">
              <thead>
              <tr>
                <th>部门编码</th>
                <th>部门名称</th>
                <th>部门描述</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in departmentList">
                <td>{{data.code}}</td>
                <td>
                  {{data.name}}
                </td>
                <td>
                  {{data.description}}
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="8">
                  <pagination-component v-bind:currentPage="searchModel.pageDto.currentPage"
                                        v-bind:showCount="searchModel.pageDto.showCount"
                                        v-bind:totalResult="baseDto.page.totalResult"
                                        v-on:updatePageIndex="pageIndexChange"
                                        @pageClick="listPage"></pagination-component>
                </td>
              </tr>
              </tfoot>
            </table>

            <!-- 项目列表 -->
            <table class="table table-hover table-bordered" v-if="projectList != null && projectList.length > 0">
              <thead>
              <tr>
                <th>项目编码</th>
                <th>项目名称</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in projectList">
                <td>{{data.code}}</td>
                <td>
                  {{data.name}}
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="8">
                  <pagination-component v-bind:currentPage="searchModel.pageDto.currentPage"
                                        v-bind:showCount="searchModel.pageDto.showCount"
                                        v-bind:totalResult="baseDto.page.totalResult"
                                        v-on:updatePageIndex="pageIndexChange"
                                        @pageClick="listPage"></pagination-component>
                </td>
              </tr>
              </tfoot>
            </table>

            <!-- 角色列表 -->
            <table class="table table-hover table-bordered" v-if="roleList != null && roleList.length > 0">
              <thead>
              <tr>
                <th>角色编码</th>
                <th>角色名称</th>
                <th>角色描述</th>
                <th>角色状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in roleList">
                <td>{{data.code}}</td>
                <td>
                  {{data.name}}
                </td>
                <td>
                  {{data.description}}
                </td>
                <td>
                  {{data.statusLabel}}
                </td>
                <td>
                  <button type="button" class="btn btn-link btn-xs" @click="setResource(data)">设置功能权限</button>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="9">
                  <pagination-component v-bind:currentPage="searchModel.pageDto.currentPage"
                                        v-bind:showCount="searchModel.pageDto.showCount"
                                        v-bind:totalResult="baseDto.page.totalResult"
                                        v-on:updatePageIndex="pageIndexChange"
                                        @pageClick="listPage"></pagination-component>
                </td>
              </tr>
              </tfoot>
            </table>

            <!-- 用户列表 -->
            <table class="table table-hover table-bordered" v-if="userList != null && userList.length > 0">
              <thead>
              <tr>
                <th>用户账号</th>
                <th>真实姓名</th>
                <th>用户类型</th>
                <th>用户描述</th>
                <th>用户状态</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in userList">
                <td>
                  {{data.loginName}}
                </td>
                <td>
                  {{data.realName}}
                </td>
                <td>
                  {{data.typeLabel}}
                </td>
                <td>
                  {{data.description}}
                </td>
                <td>
                  {{data.statusLabel}}
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="9">
                  <pagination-component v-bind:currentPage="searchModel.pageDto.currentPage"
                                        v-bind:showCount="searchModel.pageDto.showCount"
                                        v-bind:totalResult="baseDto.page.totalResult"
                                        v-on:updatePageIndex="pageIndexChange"
                                        @pageClick="listPage"></pagination-component>
                </td>
              </tr>
              </tfoot>
            </table>
          </el-main>
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
        <function-tree v-if="item.key == 'SetFunctionPermissions'"  v-bind:selectedModel="selectedModel" v-bind:selectedNode="selectedNode"></function-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.core.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.excheck.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.exedit.js'
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
    CompanyAdd,
    PaginationComponent},
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

            if (treeNode.type === '101115') { // 用户节点，不需要刷新列表，直接返回，避免列表空白难看
              return
            }

            this.listPage()
          }
        }
      },
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        id: '',
        pid: '-1',
        type: '',
        relationId: '',
        name: ''
      },
      baseDto: {page: {totalResult: 0}},
      companyList: {},
      departmentList: {},
      projectList: {},
      roleList: {},
      userList: {},
      disableAddAgentButton: true,
      disableAddParentCompanyButton: true,
      disableAddBranchCompanyButton: true,
      disableAddDepartmentButton: true,
      disableAddProjectButton: true,
      disableAddRoleButton: true,
      disableAddUserButton: true,
      disableDeleteButton: true,
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
    buildTree: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/OrganizationController/buildTree',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          let zNodes = JSON.parse(res.data.obj)
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
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/OrganizationController/listPage',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          this.baseDto = res.data
          this.companyList = res.data.obj.companyList
          this.departmentList = res.data.obj.departmentList
          this.projectList = res.data.obj.projectList
          this.roleList = res.data.obj.roleList
          this.userList = res.data.obj.userList
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
    pageIndexChange: function (e) {
      this.searchModel.pageDto.currentPage = e
    },
    search: function () {
      this.searchModel.pageDto.currentPage = 1
      this.listPage()
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
      } else if (type === '101101') { // 选中树的[代理商]节点，则启用添加总公司和部门按钮
        this.disableAddParentCompanyButton = false
        this.disableAddDepartmentButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101104') { // 选中树的[总公司]节点，则启用添加分公司和部门按钮
        this.disableAddBranchCompanyButton = false
        this.disableAddDepartmentButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101107') { // 选中树的[分公司]节点，则启用添加部门和添加项目按钮
        this.disableAddDepartmentButton = false
        this.disableAddProjectButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101109') { // 选中树的[项目]节点，则启用添加部门按钮
        this.disableAddDepartmentButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101111') { // 选中树的部门点，则启用添加岗位按钮
        this.disableAddRoleButton = false
        this.disableDeleteButton = false

        this.disableAddAgentButton = true
        this.disableAddParentCompanyButton = true
        this.disableAddBranchCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddUserButton = true
      } else if (type === '101113') { // 选中树的岗位节点，则启用添加用户按钮
        this.disableAddUserButton = false
        this.disableDeleteButton = false

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
      }
    },
    initUserOrganizationRelation: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/SysUserOrganization/init',
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
    addAgent: function () {
      this.addTab('添加代理商', 'addAgent', 'AddCompany')
    },
    addParentCompany: function () {
      this.addTab('添加总公司', 'addParentCompany', 'AddCompany')
    },
    addBranchCompany: function () {
      this.addTab('添加分公司', 'addBranchCompany', 'AddCompany')
    },
    addDepartment: function () {
      this.addTab('添加部门', 'AddDepartment', 'AddDepartment')
    },
    addProject: function () {
      this.addTab('添加项目', 'AddProject', 'AddProject')
    },
    addRole: function () {
      this.addTab('添加角色', 'AddRole', 'AddRole')
    },
    addUser: function () {
      this.addTab('添加用户', 'AddUser', 'AddUser')
    },
    setResource: function (data) {
      this.addTab('设置功能权限', 'SetFunctionPermissions', 'SetFunctionPermissions')
      this.selectedModel = data
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
  @import '../../../../static/zTree_v3.5.27/css/zTreeStyle.css';
</style>
