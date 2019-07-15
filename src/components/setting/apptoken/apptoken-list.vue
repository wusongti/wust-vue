<template>
  <div id="apptoken-list">
    <form>
      <div class="row">
        <div class="col-xs-2 form-group">
          <input type="text" class="form-control" placeholder="账号" v-model="searchModel.loginName"/>
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
              <h1>外部应用访问账号列表</h1>
            </div>
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-default" @click="create" v-has-permission="'AppTokenList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></button>
              <button type="button" class="btn btn-default" v-export-excel-directive="exportExcelPar" v-has-permission="'AppTokenList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></button>
            </div>
          </div>
        </div>
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th>应用标识</th>
              <th>账号</th>
              <th>过期时间</th>
              <th>状态</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
              <th width="160">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in baseDto.lstDto">
              <td>{{data.appId}}</td>
              <td>
                {{data.loginName}}
              </td>
              <td>
                {{data.expireTime  | formatDate('yyyy-MM-dd hh:mm:ss')}}
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
                <button type="button" class="btn btn-link btn-xs" @click="updateStatus(data)" v-has-permission="'AppTokenList.update'"><span v-if="data.status=='100201'">禁用</span><span v-if="data.status=='100202'">启用</span></button>
                <button type="button" class="btn btn-link btn-xs" @click="updatePassword(data)" v-has-permission="'AppTokenList.update'">修改密码</button>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id)" v-has-permission="'AppTokenList.delete'">删除</button>
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

    <apptoken-create v-if="showAddPopover" v-on:closePopver="closePopver('create')"></apptoken-create>
    <apptoken-update-password v-if="showUpdatePopover" v-on:closePopver="closePopver('update')" v-bind:selectedModel="selectedModel"></apptoken-update-password>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import ApptokenCreate from './apptoken-create'
import ApptokenUpdatePassword from './apptoken-update-password'

export default {
  name: 'ApptokenList',
  components: {
    ApptokenUpdatePassword,
    ApptokenCreate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        loginName: ''
      },
      baseDto: {page: {totalResult: 0}},
      showAddPopover: false,
      showUpdatePopover: false,
      selectedModel: {},
      exportExcelPar: {
        excelSuffix: 'xls',
        xmlName: 'admin_apptoken',
        moduleName: 'apptoken'}
    }
  },
  created: function () {
    this.listPage()
  },
  methods: {
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/AppTokenController/listPage',
        data: this.searchModel
      }).then(res => {
        if (res.data.messageMap.flag === 'SUCCESS') {
          this.baseDto = res.data
        } else {
          this.$message('info', res.data.message, 3000)
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
    updatePassword: function (data) {
      this.selectedModel = data
      if (this.showUpdatePopover) {
        this.showUpdatePopover = false
      } else {
        this.showUpdatePopover = true
      }
    },
    updateStatus: function (data) {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/AppTokenController/updateStatus',
        data: data
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message('warning', res.data.message, 3000)
        } else {
          this.$message('success', '操作成功', 3000)
          this.listPage()
        }
      })
    },
    deleteById: function (id) {
      this.$dialog('询问', '您确定删除该记录吗？', true, true,
        () => { // 点击确定
          Vue.$ajax({
            method: 'delete',
            url: Vue.$adminServerURL + '/AppTokenController/delete/' + id
          }).then(res => {
            if (res.data.flag !== 'SUCCESS') {
              this.$message('warning', res.data.message, 3000)
            } else {
              this.$message('success', '成功', 3000)
              this.listPage()
            }
          })
        },
        () => { // 点击关闭

        }
      )
    },
    closePopver: function (type) {
      if (type === 'create') {
        this.showAddPopover = false
      } else {
        this.showUpdatePopover = false
      }
      this.listPage()
    }
  }
}
</script>
