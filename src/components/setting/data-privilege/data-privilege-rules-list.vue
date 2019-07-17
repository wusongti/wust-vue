<template>
  <div id="data-privilege-rules-list">
    <form>
      <div class="row">
        <div class="col-xs-2 form-group">
          <input type="text" class="form-control" placeholder="业务" v-model="searchModel.businessName"/>
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
              <h1>数据权限列表</h1>
            </div>
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
            </div>
          </div>
        </div>
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th width="350">业务</th>
              <th>规则</th>
              <th width="80">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in baseDto.lstDto">
              <td>{{data.businessName}}</td>
              <td>
                {{data.typeName}}
              </td>
              <td>
                <button type="button" class="btn btn-link btn-xs" @click="update(data)" v-has-permission="'DataPrivilegeRulesList.update'">修改</button>
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
    <data-privilege-rules-update v-if="showUpdatePopover" v-on:closePopover="closePopover('update')" v-bind:selectedModel="selectedModel"></data-privilege-rules-update>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import DataPrivilegeRulesUpdate from './data-privilege-rules-update'

export default {
  name: 'DataPrivilegeRulesList',
  components: {
    DataPrivilegeRulesUpdate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        businessName: ''
      },
      baseDto: {page: {totalResult: 0}},
      showAddPopover: false,
      showUpdatePopover: false,
      selectedModel: {}
    }
  },
  created: function () {
    this.listPage()
  },
  methods: {
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataPrivilegeRulesController/listPage',
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
    update: function (data) {
      this.selectedModel = data
      if (this.showUpdatePopover) {
        this.showUpdatePopover = false
      } else {
        this.showUpdatePopover = true
      }
    },
    closePopover: function (type) {
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
