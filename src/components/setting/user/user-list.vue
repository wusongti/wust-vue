<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <el-tabs  type="card" v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
    <el-tab-pane :name="defaultActiveName" label="用户列表">
      <form>
        <div class="row">
          <div class="col-xs-2 form-group">
            <input type="text" class="form-control" placeholder="登录账号" v-model="searchModel.loginName"/>
          </div>
          <div class="col-xs-2 form-group">
            <input type="text" class="form-control" placeholder="真实姓名" v-model="searchModel.realName">
          </div>
          <div class="col-xs-2 form-group">
            <select class="form-control" v-data-dictionary-directive:1002 v-model="searchModel.status">
            </select>
          </div>
          <div>
            <button class="btn btn-danger btn-sm" type="reset">重置</button>
            <button class="btn btn-primary btn-sm" type="button" @click="search">查询</button>
          </div>
        </div>
      </form>
      <div class="panel-body progress-panel">
        <div class="row">
          <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
            <button type="button" class="btn btn-default" @click="create" v-has-permission="'UserList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></button>
            <button type="button" class="btn btn-default"  v-file-download-directive="'user_template.xls'"><span class="glyphicon glyphicon-download" aria-hidden="true">模板下载</span></button>
            <button type="button" class="btn btn-default" @click="importByExcel" v-has-permission="'UserList.import'"><span class="glyphicon glyphicon-import" aria-hidden="true">导入</span></button>
            <button type="button" class="btn btn-default" v-export-excel-directive="exportExcelPar" v-has-permission="'UserList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></button>
          </div>
        </div>
      </div>
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>登录账号</th>
            <th>真实姓名</th>
            <th>联系电话</th>
            <th>用户类型</th>
            <th>性别</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>在线状态</th>
            <th>创建人</th>
            <th>创建时间</th>
            <th>更新人</th>
            <th>最后更新时间</th>
            <th width="120">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in baseDto.lstDto">
            <td>{{data.loginName}}</td>
            <td>
              {{data.realName}}
            </td>
            <td>
              {{data.mobile}}
            </td>
            <td>
              {{data.typeLabel}}
            </td>
            <td>
              {{data.sexLabel}}
            </td>
            <td>
              {{data.email}}
            </td>
            <td>
              {{data.statusLabel}}
            </td>
            <td>
              {{data.onlineStatusLabel}}
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
              <button type="button" class="btn btn-link btn-xs" @click="update(data)" v-if="data.type != '100401'" v-has-permission="'UserList.update'">修改</button>
              <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id)" v-if="data.type != '100401'" v-has-permission="'UserList.delete'">删除</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="13">
                <pagination-component v-bind:currentPage="searchModel.pageDto.currentPage"
                            v-bind:showCount="searchModel.pageDto.showCount"
                            v-bind:totalResult="baseDto.page.totalResult"
                            v-on:updatePageIndex="pageIndexChange"
                            @pageClick="listPage"></pagination-component>
            </td>
          </tr>
        </tfoot>
      </table>

    </el-tab-pane>
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="item.name"
      :label="item.label"
      :name="item.name"
      closable>
      <user-create v-if="item.key == 'create'"></user-create>
      <user-update v-if="item.key == 'update'" v-bind:selectedModel="selectedModel"></user-update>
      <user-import v-if="item.key == 'import'"></user-import>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import UserCreate from './user-create'
import UserUpdate from './user-update'
import UserImport from './user-import'

export default {
  name: 'UserList',
  components: {
    UserImport,
    UserCreate,
    UserUpdate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        loginName: '',
        realName: '',
        sex: '',
        email: '',
        type: '',
        status: ''
      },
      baseDto: {page: {totalResult: 0}},
      selectedModel: {},
      exportExcelPar: {
        excelSuffix: 'xls',
        xmlName: 'admin_user',
        moduleName: 'user'
      },
      defaultActiveName: 'UserList',
      editableTabsValue: 'UserList',
      editableTabs: [],
      tabIndex: 2
    }
  },
  created: function () {
    this.listPage()
  },
  methods: {
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/UserController/listPage',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          this.baseDto = res.data
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
    create: function () {
      this.addTab('新建用户', 'CreateUser', 'create')
    },
    update: function (data) {
      this.selectedModel = data
      this.addTab('修改用户', 'UpdateUser', 'update')
    },
    deleteById: function (id) {
      this.$confirm('您确定删除该记录吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$adminServerURL + '/UserController/delete/' + id
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
      }).catch(() => {
      })
    },
    importByExcel: function () {
      this.addTab('导入用户', 'ImportUser', 'import')
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
              this.listPage()
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    clickTab: function (tab) {
      if (tab.name === this.defaultActiveName) {
        this.listPage()
      }
    }
  }
}
</script>
