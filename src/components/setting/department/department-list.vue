<template>
  <div>
    <el-tabs  type="card" v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="部门列表">
        <form>
          <div class="col-xs-2 form-group">
            <input type="text" class="form-control" placeholder="部门名" v-model="searchModel.name"/>
          </div>
          <div>
            <button class="btn btn-danger btn-sm" type="reset">重置</button>
            <button class="btn btn-primary btn-sm" type="button" @click="search">查询</button>
          </div>
        </form>
        <div class="panel-body progress-panel">
          <div class="row">
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-default" @click="create" v-has-permission="'DepartmentList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></button>
              <button type="button" class="btn btn-default" v-export-excel-directive="exportExcelPar" v-has-permission="'DepartmentList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></button>
            </div>
          </div>
        </div>
          <table class="table table-hover table-bordered">
            <thead>
            <tr>
              <th>编码</th>
              <th>部门名称</th>
              <th>部门负责人</th>
              <th>描述</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
              <th width="140">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="data.id" v-for="data in baseDto.lstDto">
              <td>{{data.code}}</td>
              <td>
                {{data.name}}
              </td>
              <td>
                {{data.leaderName}}
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
                <button type="button" class="btn btn-link btn-xs" @click="update(data)" v-has-permission="'DepartmentList.update'">修改</button>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id)" v-has-permission="'DepartmentList.delete'">删除</button>
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
        <department-create v-if="item.key == 'create'"></department-create>
        <department-update v-if="item.key == 'update'" v-bind:selectedModel="selectedModel"></department-update>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import DepartmentCreate from './department-create'
import DepartmentUpdate from './department-update'

export default {
  name: 'DepartmentList',
  components: {
    DepartmentUpdate,
    DepartmentCreate,
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
        excelSuffix: 'xls',
        xmlName: 'admin_department',
        moduleName: 'department'
      },
      defaultActiveName: 'DepartmentList',
      editableTabsValue: 'DepartmentList',
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
        url: Vue.$adminServerURL + '/DepartmentController/listPage',
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
      this.addTab('新建部门', 'CreateDepartment', 'create')
    },
    update: function (data) {
      this.selectedModel = data
      this.addTab('编辑部门信息', 'UpdateDepartment', 'update')
    },
    deleteById: function (id) {
      this.$confirm('您确定删除该记录吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$adminServerURL + '/DepartmentController/delete/' + id
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
