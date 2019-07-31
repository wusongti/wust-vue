/**
* Created by WST on 2019/5/23.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div>
    <el-tabs  type="card" >
      <el-tab-pane label="操作日志">
        <form>
          <div class="row">
            <div class="col-xs-2 form-group">
              <select class="form-control" v-data-dictionary-directive:1005 v-model="searchModel.status">
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
            </div>
          </div>
        </div>
        <table class="table table-hover table-bordered">
          <thead>
          <tr>
            <th>编号</th>
            <th>模块名</th>
            <th>操作类型</th>
            <th>状态</th>
            <th>描述</th>
            <th>文件大小</th>
            <th>文件类型</th>
            <th width="200">开始时间</th>
            <th width="200">结束时间</th>
            <th width="80">创建人</th>
            <th width="150">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="data.id" v-for="data in baseDto.lstDto">
            <td>{{data.batchNo}}</td>
            <td>
              {{data.moduleName}}
            </td>
            <td>
              {{data.operationTypeLabel}}
            </td>
            <td>
              {{data.statusLabel}}
            </td>
            <td>
              {{data.description}}
            </td>
            <td>
              {{data.size}}KB
            </td>
            <td>
              {{data.suffix}}
            </td>
            <td>
              {{data.startTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
            </td>
            <td>
              {{data.endTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
            </td>
            <td>
              {{data.createrName}}
            </td>
            <td>
              <button type="button" class="btn btn-link btn-xs" @click="downloadLog(data.batchNo)" v-has-permission="'MyImportExportList.download'">下载日志</button>
              <button type="button" class="btn btn-link btn-xs" @click="downloadExcel(data.batchNo)" v-has-permission="'MyImportExportList.download'">下载文件</button>
            </td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td colspan="12">
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
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'

export default {
  name: 'ImportExportList',
  components: {
    PaginationComponent
  },
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        status: ''
      },
      baseDto: {page: {totalResult: 0}}
    }
  },
  created: function () {
    this.listPage()
  },
  methods: {
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/MyImportExportController/listPage',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          this.baseDto = res.data
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
    downloadExcel: function (id) {
      window.location.href = Vue.$adminServerURL + '/MyImportExportController/downloadFile?x-auth-token=' + this.loginContext.getLoginContext().xAuthToken + '&&relationId=' + id + '&&relationField=excel'
    },
    downloadLog: function (id) {
      window.location.href = Vue.$adminServerURL + '/MyImportExportController/downloadFile?x-auth-token=' + this.loginContext.getLoginContext().xAuthToken + '&&relationId=' + id + '&&relationField=log'
    },
    pageIndexChange: function (e) {
      this.searchModel.pageDto.currentPage = e
    },
    search: function () {
      this.searchModel.pageDto.currentPage = 1
      this.listPage()
    }
  }
}
</script>
