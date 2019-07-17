<template>
  <div id="organization-list">
    <div class="myTab-body">
      <div class="tree-box">
        <input class="form-control" placeholder="Search" type="text" v-on:keyup.13="onSearch">
        <ul id="tree" class="ztree"></ul>
      </div>
      <div class="myTab-view">
        <form>
          <div class="row">
            <div class="col-xs-4 form-group">
              <input type="text" class="form-control" placeholder="名称" v-model="searchModel.name"/>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" type="button" @click="search">查询</button>
            </div>
          </div>
        </form>
        <section class="panel">
          <div class="row">
            <div class="col-lg-8 task-progress pull-left" style="color: red">
              当前位置：{{selectedNode.name}}
            </div>
          </div>
          <div class="panel-body progress-panel">
            <div class="row">
              <div class="col-lg-8 task-progress left">
                <h1>组织架构列表</h1>
              </div>
              <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
                <button type="button" class="btn btn-default" v-bind:disabled="disableAddCompanyButtom" @click="addCompany" v-has-permission="'OrganizationList.addCompany'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加公司</span></button>
                <button type="button" class="btn btn-default" v-bind:disabled="disableAddDepartmentButtom" @click="addDepartment" v-has-permission="'OrganizationList.addDepartment'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加部门</span></button>
                <button type="button" class="btn btn-default" v-bind:disabled="disableAddRoleButtom" @click="addRole" v-has-permission="'OrganizationList.addRole'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加角色</span></button>
                <button type="button" class="btn btn-default" v-bind:disabled="disableAddUserButtom" @click="addUser" v-has-permission="'OrganizationList.addUser'"><span class="glyphicon glyphicon-plus" aria-hidden="true">添加用户</span></button>
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
                <th>创建人</th>
                <th>创建时间</th>
                <th>更新人</th>
                <th>最后更新时间</th>
                <th>操作</th>
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
                <td>
                  {{data.createrName}}
                </td>
                <td>
                  {{data.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
                </td>
                <td>
                  {{data.modifyName}}
                </td>
                <td>
                  {{data.modifyTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
                </td>
                <td>
                  <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'sys_company')" v-has-permission="'OrganizationList.delete'">移除</button>
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
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
              <th>操作</th>
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
              <td>
                {{data.createrName}}
              </td>
              <td>
                {{data.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
              </td>
              <td>
                {{data.modifyName}}
              </td>
              <td>
                {{data.modifyTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
              </td>
              <td>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'sys_department')" v-has-permission="'OrganizationList.delete'">移除</button>
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
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
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
                {{data.createrName}}
              </td>
              <td>
                {{data.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
              </td>
              <td>
                {{data.modifyName}}
              </td>
              <td>
                {{data.modifyTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
              </td>
              <td>
                <button type="button" class="btn btn-link btn-xs" @click="setResource(data)">设置功能权限</button>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'sys_role')" v-has-permission="'OrganizationList.delete'">移除</button>
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
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
              <th>操作</th>
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
                {{data.description}}
              </td>
              <td>
                {{data.statusLabel}}
              </td>
              <td>
                {{data.createrName}}
              </td>
              <td>
                {{data.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
              </td>
              <td>
                {{data.modifyName}}
              </td>
              <td>
                {{data.modifyTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
              </td>
              <td>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id,'sys_user')" v-has-permission="'OrganizationList.delete'">移除</button>
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
        </section>
      </div>
    </div>
    <company-add v-if="showAddCompanyPopover" v-on:closePopver="closePopver('sys_company')" v-bind:selectedNode="selectedNode"></company-add>
    <department-add v-if="showAddDepartmentPopover" v-on:closePopver="closePopver('sys_department')" v-bind:selectedNode="selectedNode"></department-add>
    <role-add v-if="showAddRolePopover" v-on:closePopver="closePopver('sys_role')" v-bind:selectedNode="selectedNode"></role-add>
    <user-add v-if="showAddUserPopover" v-on:closePopver="closePopver('sys_user')" v-bind:selectedNode="selectedNode"></user-add>
    <function-tree v-if="showFunctionTreePopover" v-on:closePopver="closePopver('function_tree')" v-bind:selectedModel="selectedModel" v-bind:selectedNode="selectedNode"></function-tree>
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
            this.switchButtomAvailableStatus(treeNode.type)

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
      roleList: {},
      userList: {},
      disableAddCompanyButtom: true,
      disableAddDepartmentButtom: true,
      disableAddRoleButtom: true,
      disableAddUserButtom: true,
      showAddCompanyPopover: false,
      showAddDepartmentPopover: false,
      showAddRolePopover: false,
      showAddUserPopover: false,
      showFunctionTreePopover: false,
      selectedNode: {id: '', pid: '-1', type: '', relationId: ''},
      searchHitZNodes: [],
      selectedModel: {},
      exportExcelPar: {
        excelSuffix: 'xls',
        xmlName: 'admin_organization',
        moduleName: 'organization'}
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
          var treeObj = $.fn.zTree.init($('#tree'), this.setting, zNodes)

          if (this.selectedNode != null && this.selectedNode.id !== '') {
            this.expandParentNodes(this.selectedNode.children[0], treeObj)
            // eslint-disable-next-line no-undef
            $('#' + this.selectedNode.tId + '_a').click()
          } else {
            var nodes = treeObj.getNodes()
            if (nodes.length > 0) {
              // eslint-disable-next-line no-undef
              $('#tree_1_a').click()
            }
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
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
          this.roleList = res.data.obj.roleList
          this.userList = res.data.obj.userList
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
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
      let searchKeyWord = $even.currentTarget.value
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
    switchButtomAvailableStatus: function (type) {
      if (type === '') {
        this.disableAddCompanyButtom = false

        this.disableAddDepartmentButtom = true
        this.disableAddRoleButtom = true
        this.disableAddUserButtom = true
      } else if (type === 'sys_company') {
        this.disableAddDepartmentButtom = false

        this.disableAddCompanyButtom = true
        this.disableAddRoleButtom = true
        this.disableAddUserButtom = true
      } else if (type === 'sys_department') {
        this.disableAddRoleButtom = false

        this.disableAddCompanyButtom = true
        this.disableAddDepartmentButtom = true
        this.disableAddUserButtom = true
      } else if (type === 'sys_role') {
        this.disableAddUserButtom = false

        this.disableAddCompanyButtom = true
        this.disableAddDepartmentButtom = true
        this.disableAddRoleButtom = true
      } else if (type === 'sys_user') {
        this.disableAddCompanyButtom = true
        this.disableAddDepartmentButtom = true
        this.disableAddRoleButtom = true
        this.disableAddUserButtom = true
      }
    },
    addCompany: function () {
      if (this.showAddCompanyPopover) {
        this.showAddCompanyPopover = false
      } else {
        this.showAddCompanyPopover = true
      }
    },
    addDepartment: function () {
      if (this.showAddDepartmentPopover) {
        this.showAddDepartmentPopover = false
      } else {
        this.showAddDepartmentPopover = true
      }
    },
    addRole: function () {
      if (this.showAddRolePopover) {
        this.showAddRolePopover = false
      } else {
        this.showAddRolePopover = true
      }
    },
    addUser: function () {
      if (this.showAddUserPopover) {
        this.showAddUserPopover = false
      } else {
        this.showAddUserPopover = true
      }
    },
    deleteById: function (relationId, type) {
      let that = this
      this.$dialog('询问', '您确定删除该记录吗？', true, true,
        () => { // 点击确定
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
              this.listPage()
            }
          })
        },
        () => { // 点击关闭

        }
      )
    },
    setResource: function (data) {
      if (this.showFunctionTreePopover) {
        this.showFunctionTreePopover = false
      } else {
        this.showFunctionTreePopover = true
      }
      this.selectedModel = data
    },
    closePopver: function (type) {
      if (type === 'sys_company') {
        this.showAddCompanyPopover = false
      } else if (type === 'sys_department') {
        this.showAddDepartmentPopover = false
      } else if (type === 'sys_role') {
        this.showAddRolePopover = false
      } else if (type === 'sys_user') {
        this.showAddUserPopover = false
      } else if (type === 'function_tree') {
        this.showFunctionTreePopover = false
      }
      this.buildTree()
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
