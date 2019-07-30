<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>组织架构</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs  type="card" v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="组织架构">
        <el-container>
          <el-aside width="220px" style="height: 75vh;border: 1px solid #eee">
            <el-form @submit.native.prevent>
              <el-input size="mini" @keyup.enter.native="onSearch">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form>
            <ul id="tree" class="ztree"></ul>
          </el-aside>
          <el-main style="border-bottom:1px solid #eee;border-right: 1px solid #eee;border-top:1px solid #eee;">
            <div class="panel-body progress-panel">
              <div class="row">
                <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddCompanyButton" @click="addCompany" v-has-permission="'OrganizationList.addCompany'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加公司</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddDepartmentButton" @click="addDepartment" v-has-permission="'OrganizationList.addDepartment'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加部门</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddProjectButton" @click="addProject" v-has-permission="'OrganizationList.addProject'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加项目</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddRoleButton" @click="addRole" v-has-permission="'OrganizationList.addRole'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加角色</span></button>
                  <button type="button" class="btn btn-default" v-bind:disabled="disableAddUserButton" @click="addUser" v-has-permission="'OrganizationList.addUser'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加用户</span></button>
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
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr :key="data.id" v-for="data in companyList">
                <td>{{data.code}}</td>
                <td>
                  {{data.name}}
                </td>
                <td>
                  {{data.description}}
                </td>
                <td>
                  <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'101107')" v-has-permission="'OrganizationList.delete'">移除</button>
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
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr :key="data.id" v-for="data in departmentList">
                <td>{{data.code}}</td>
                <td>
                  {{data.name}}
                </td>
                <td>
                  {{data.description}}
                </td>
                <td>
                  <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'101111')" v-has-permission="'OrganizationList.delete'">移除</button>
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
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr :key="data.id" v-for="data in projectList">
                <td>{{data.code}}</td>
                <td>
                  {{data.name}}
                </td>
                <td>
                  <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'101109')" v-has-permission="'OrganizationList.delete'">移除</button>
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
              <tr :key="data.id" v-for="data in roleList">
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
                  <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'101113')" v-has-permission="'OrganizationList.delete'">移除</button>
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
                <th>用户描述</th>
                <th>用户状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr :key="data.id" v-for="data in userList">
                <td>
                  {{data.loginName}}
                </td>
                <td>
                  {{data.realName}}
                </td>
                <td>
                  {{data.description}}
                </td>
                <td>
                  {{data.statusLabel}}
                </td>
                <td>
                  <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'101115')" v-has-permission="'OrganizationList.delete'">移除</button>
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
        <company-add v-if="item.key == 'AddCompany'"  v-bind:selectedNode="selectedNode"></company-add>
        <department-add v-if="item.key == 'AddDepartment'"  v-bind:selectedNode="selectedNode"></department-add>
        <role-add v-if="item.key == 'AddRole'" v-bind:selectedNode="selectedNode"></role-add>
        <user-add v-if="item.key == 'AddUser'" v-bind:selectedNode="selectedNode"></user-add>
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

export default {
  name: 'OrganizationList',
  components: {
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
              color: '#333',
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

            if (treeNode.type === 'sys_user') {
              return
            }
            this.selectedNode = treeNode
            this.searchModel.pid = treeNode.id
            this.searchModel.type = treeNode.type
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
      disableAddCompanyButton: true,
      disableAddDepartmentButton: true,
      disableAddProjectButton: true,
      disableAddRoleButton: true,
      disableAddUserButton: true,
      selectedNode: {id: '', pid: '-1', type: '', relationId: ''},
      searchHitZNodes: [],
      selectedModel: {},
      exportExcelPar: {
        excelSuffix: 'xls',
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
      this.companyList = null
      this.departmentList = null
      this.roleList = null
      this.userList = null
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
      if (type === '') { // 选中树的[根]节点，则启用添加公司按钮
        this.disableAddCompanyButton = false

        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101101' || type === '101104') { // 选中树的[代理商、总公司]节点，则启用添加公司和部门按钮
        this.disableAddCompanyButton = false
        this.disableAddDepartmentButton = false

        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101107') { // 选中树的[分公司]节点，则启用添加部门和添加项目按钮
        this.disableAddDepartmentButton = false
        this.disableAddProjectButton = false

        this.disableAddCompanyButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101109') { // 选中树的[代理商、总公司、分公司、项目]节点，则启用添加部门按钮
        this.disableAddDepartmentButton = false

        this.disableAddCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      } else if (type === '101111') { // 选中树的部门点，则启用添加岗位按钮
        this.disableAddRoleButton = false

        this.disableAddCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddUserButton = true
      } else if (type === '101113') { // 选中树的岗位节点，则启用添加用户按钮
        this.disableAddUserButton = false

        this.disableAddCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddRoleButton = true
      } else if (type === '101115') { // 选中树的用户节点，则禁用所有按钮
        this.disableAddCompanyButton = true
        this.disableAddProjectButton = true
        this.disableAddDepartmentButton = true
        this.disableAddRoleButton = true
        this.disableAddUserButton = true
      }
    },
    addCompany: function () {
      this.addTab('添加公司', 'AddCompany', 'AddCompany')
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
    deleteById: function (relationId, type) {
      let that = this

      this.$confirm('您确定删除该记录吗', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$adminServerURL + '/OrganizationController/delete/' + that.selectedNode.id + '/' + relationId + '/' + type
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
            this.buildTree()
          }
        })
      }).catch(() => {
      })
    },
    addTab: function (label, name, key) {
      let ele = {label: label, name: name, key: key}
      let flag = false
      this.editableTabs.every((val, idx, array) => {
        if (val.key === ele.key) {
          flag = true
        }
      })
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
              this.buildTree()
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    clickTab: function (tab) {
      if (tab.name === this.defaultActiveName) {
        this.buildTree()
      }
    }
  }
}
</script>
<style>
  @import '../../../../static/zTree_v3.5.27/css/zTreeStyle.css';

  .myTab-body{
    min-height: 550px;
    display: flex;
  }
  .tree-box,.myTab-view{
    min-height: 560px;
    height: 100%;
  }
  .tree-box{
    width: 20%;
    height:550px;
    border-right: 1px solid #e7e7e7;
    overflow-y:scroll;
    overflow-x:auto;
  }
  .myTab-view{
    flex-grow: 1;
    margin-left: 3px;
  }
</style>
