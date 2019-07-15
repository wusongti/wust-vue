<template>
  <div id="datasource-list">
    <form>
      <div class="row">
        <div class="col-xs-2 form-group">
          <input type="text" class="form-control" placeholder="公司名" v-model="searchModel.name"/>
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
              <h1>数据源列表</h1>
            </div>
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
            </div>
          </div>
        </div>
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th width="200">数据源</th>
              <th>JDBC URL</th>
              <th>JDBC User Name</th>
              <th>JDBC Password</th>
              <th width="100">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in baseDto.lstDto">
              <td>{{data.companyName}}</td>
              <td>
                {{data.jdbcUrl}}
              </td>
              <td>
                {{data.jdbcUsername}}
              </td>
              <td>
                {{data.jdbcPassword}}
              </td>
              <td>
                <button type="button" class="btn btn-link btn-xs" v-if="data.initStatus == 0" @click="initDataSource(data)">初始化数据源</button>
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
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'

export default {
  name: 'DataSourceList',
  components: {
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        companyName: ''
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
        url: Vue.$adminServerURL + '/DataSourceController/listPage',
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
    initDataSource: function (data) {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataSourceController/create',
        data: data
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message('warning', res.data.message, 3000)
        } else {
          this.$message('success', '操作成功', 3000)
          this.search()
        }
      })
    }
  }
}
</script>
