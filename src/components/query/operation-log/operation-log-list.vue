/**
* Created by WST on 2019/5/28.
*/
<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
      <el-breadcrumb-item>查询管理</el-breadcrumb-item>
      <el-breadcrumb-item>操作日志</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs  type="card" >
      <el-tab-pane label="操作日志">
          <form>
            <div class="row">
              <div class="col-xs-2 form-group">
                <input type="text" class="form-control" placeholder="模块名" v-model="searchModel.moduleName"/>
              </div>
              <div class="col-xs-2 form-group">
                <input type="text" class="form-control" placeholder="业务名" v-model="searchModel.businessName">
              </div>
              <div class="col-xs-2 form-group">
                <select class="form-control"  v-model="searchModel.operationType">
                  <option value="" selected>--请选择--</option>
                  <option value="新增">新增</option>
                  <option value="修改">修改</option>
                  <option value="删除">删除</option>
                  <option value="查询">查询</option>
                  <option value="保存">保存</option>
                  <option value="上传">上传</option>
                  <option value="下载">下载</option>
                  <option value="导入">导入</option>
                  <option value="导出">导出</option>
                  <option value="登录">登录</option>
                  <option value="登出">登出</option>
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
              <th>操作模块</th>
              <th>操作业务</th>
              <th>操作类型</th>
              <th>操作角色</th>
              <th>操作用户</th>
              <th>操作时间</th>
              <th>操作IP</th>
              <th>来源</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="data.id" v-for="data in baseDto.lstDto">
              <td>{{data.moduleName}}</td>
              <td>
                {{data.businessName}}
              </td>
              <td>
                {{data.operationType}}
              </td>
              <td>
                {{data.operationRole}}
              </td>
              <td>
                {{data.userRealName}}
              </td>
              <td>
                {{data.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
              </td>
              <td>
                {{data.operationIp}}
              </td>
              <td>
                {{data.source}}
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'

export default {
  name: 'OprationLogList',
  components: {
    PaginationComponent
  },
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        moduleName: '',
        businessName: '',
        operationType: ''
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
        url: Vue.$adminServerURL + '/OperationLogController/listPage',
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
