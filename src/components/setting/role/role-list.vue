<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div id="role-list">
    <form>
      <div class="row">
        <div class="col-xs-2 form-group">
          <input type="text" class="form-control" placeholder="角色名" v-model="searchModel.name"/>
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
    <div class="row">
      <section class="panel">
        <div class="panel-body progress-panel">
          <div class="row">
            <div class="col-lg-8 task-progress pull-left">
              <h1>角色列表</h1>
            </div>
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-default" @click="create" v-has-permission="'RoleList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></button>
              <button type="button" class="btn btn-default"  v-file-download-directive="'user_template.xls'"><span class="glyphicon glyphicon-download" aria-hidden="true">模板下载</span></button>
              <button type="button" class="btn btn-default" @click="importByExcel" v-has-permission="'RoleList.import'"><span class="glyphicon glyphicon-import" aria-hidden="true">导入</span></button>
              <button type="button" class="btn btn-default" v-export-excel-directive="exportExcelPar" v-has-permission="'RoleList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></button>
            </div>
          </div>
        </div>
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th>编码</th>
              <th>名称</th>
              <th>描述</th>
              <th>状态</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
              <th width="120">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in baseDto.lstDto">
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
                <button type="button" class="btn btn-link btn-xs" @click="update(data)" v-has-permission="'RoleList.update'">修改</button>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id)" v-has-permission="'RoleList.delete'">删除</button>
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
      </section>
    </div>
    <role-create v-if="showAddPopover" v-on:closePopover="closePopover('create')"></role-create>
    <role-update v-if="showUpdatePopover" v-on:closePopover="closePopover('update')" v-bind:selectedModel="selectedModel"></role-update>
    <role-import  v-if="showImportPopover" v-on:closePopover="closePopover('import')"></role-import>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import RoleCreate from './role-create'
import RoleUpdate from './role-update'
import RoleImport from './role-import'

export default {
  name: 'RoleList',
  components: {
    RoleImport,
    RoleCreate,
    RoleUpdate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        name: '',
        status: ''
      },
      baseDto: {page: {totalResult: 0}},
      showAddPopover: false,
      showUpdatePopover: false,
      showImportPopover: false,
      selectedModel: {},
      exportExcelPar: {
        excelSuffix: 'xls',
        xmlName: 'admin_role',
        moduleName: 'role'}
    }
  },
  created: function () {
    this.listPage()
  },
  methods: {
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/RoleController/listPage',
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
      if (this.showAddPopover) {
        this.showAddPopover = false
      } else {
        this.showAddPopover = true
      }
    },
    update: function (data) {
      this.selectedModel = data
      if (this.showUpdatePopover) {
        this.showUpdatePopover = false
      } else {
        this.showUpdatePopover = true
      }
    },
    deleteById: function (id) {
      this.$confirm('您确定删除该记录吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$adminServerURL + '/RoleController/delete/' + id
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
      if (this.showImportPopover) {
        this.showImportPopover = false
      } else {
        this.showImportPopover = true
      }
    },
    closePopover: function (type) {
      if (type === 'create') {
        this.showAddPopover = false
      } else if (type === 'update') {
        this.showUpdatePopover = false
      } else {
        this.showImportPopover = false
      }
      this.listPage()
    }
  }
}
</script>
