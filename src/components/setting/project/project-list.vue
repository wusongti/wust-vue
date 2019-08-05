<template>
  <div>
    <el-tabs  type="border-card" v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="项目列表">
        <form>
          <div class="col-xs-2 form-group">
            <input type="text" class="form-control" placeholder="项目名" v-model="searchModel.name"/>
          </div>
          <div>
            <button class="btn btn-danger btn-sm" type="reset">重置</button>
            <button class="btn btn-primary btn-sm" type="button" @click="search">查询</button>
          </div>
        </form>
        <div class="panel-body progress-panel">
          <div class="row">
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-default" @click="create" v-has-permission="'ProjectList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></button>
              <button type="button" class="btn btn-default" v-export-excel-directive="exportExcelPar" v-has-permission="'ProjectList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></button>
            </div>
          </div>
        </div>
          <table class="table table-hover table-bordered">
            <thead>
            <tr>
              <th width="60">编码</th>
              <th>项目名称</th>
              <th>项目地址</th>
              <th>描述</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
              <th width="100">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="data.id" v-for="data in baseDto.lstDto">
              <td>{{data.code}}</td>
              <td>
                {{data.name}}
              </td>
              <td>
                {{data.addr}}
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
                <button type="button" class="btn btn-link btn-xs" @click="update(data)" v-has-permission="'ProjectList.update'">修改</button>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id)" v-has-permission="'ProjectList.delete'">删除</button>
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
        <project-create v-if="item.key == 'create'"></project-create>
        <project-update v-if="item.key == 'update'" v-bind:selectedModel="selectedModel"></project-update>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import ProjectCreate from './project-create'
import ProjectUpdate from './project-update'

export default {
  name: 'ProjectList',
  components: {
    ProjectUpdate,
    ProjectCreate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        name: ''
      },
      baseDto: {page: {totalResult: 0}},
      selectedModel: {},
      exportExcelPar: {
        fileType: 'xls',
        xmlName: 'admin_project',
        moduleName: 'project'
      },
      defaultActiveName: 'ProjectList',
      editableTabsValue: 'ProjectList',
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
        url: Vue.$adminServerURL + '/ProjectController/listPage',
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
    },
    create: function () {
      this.addTab('新建项目', 'CreateProject', 'create')
    },
    update: function (data) {
      this.selectedModel = data
      this.addTab('编辑项目', 'UpdateProject', 'update')
    },
    deleteById: function (id) {
      this.$confirm('您确定删除该记录吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$adminServerURL + '/ProjectController/delete/' + id
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
    addTab: function (label, name, key) {
      let ele = {label: label, name: name, key: key}
      let flag = false

      for (let i = 0; i < this.editableTabs.length; i++) {
        let var1 = this.editableTabs[i]
        if (var1.key === key) {
          flag = true
          break
        }
      }

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
