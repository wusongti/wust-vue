<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>数据权限</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs  type="card" v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="数据权限列表">
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
        <div class="panel-body progress-panel">
          <div class="row">
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
      </el-tab-pane>
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.label"
        :name="item.name"
        closable>
        <data-privilege-rules-update v-if="item.key == 'update'" v-bind:selectedModel="selectedModel"></data-privilege-rules-update>
      </el-tab-pane>
    </el-tabs>
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
      selectedModel: {},
      defaultActiveName: 'DataPrivilegeRulesList',
      editableTabsValue: 'DataPrivilegeRulesList',
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
      this.addTab('修改数据权限', 'UpdateDataPrivilegeRules', 'update')
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
