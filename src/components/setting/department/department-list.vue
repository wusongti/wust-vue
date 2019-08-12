<template>
  <div>
    <el-tabs v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
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
        <el-button-group class="pull-right">
          <el-button size="mini" @click="create" v-has-permission="'DepartmentList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></el-button>
          <el-button size="mini" v-export-excel-directive="exportExcelPar" v-has-permission="'DepartmentList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></el-button>
        </el-button-group>
        <el-table
          border
          :data="baseDto.lstDto">
          style="width: 100%">
          <el-table-column
            prop="code"
            label="编码"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="部门名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createrName"
            label="创建人"
            width="100">
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="modifyName"
            label="更新人"
            width="100">
          </el-table-column>
          <el-table-column
            label="最后更新时间"
            width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.modifyTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <button type="button" class="btn btn-link btn-xs" @click="update(scope.row)" v-has-permission="'CompanyList.update'">修改</button>
              <button type="button" class="btn btn-link btn-xs" @click="deleteById(scope.row.id)" v-has-permission="'CompanyList.delete'">删除</button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="pageIndexChange"
          :current-page="searchModel.pageDto.currentPage"
          :page-sizes="searchModel.pageDto.pageSizes"
          :page-size="searchModel.pageDto.showCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="baseDto.page.totalResult">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.key"
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
        pageDto: {showCount: 10, currentPage: 1, pageSizes: [10, 20, 30, 100]},
        name: ''
      },
      baseDto: {page: {totalResult: 0}},
      selectedModel: {},
      exportExcelPar: {
        fileType: 'xls',
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
    pageSizeChange: function (e) {
      this.searchModel.pageDto.showCount = e
      this.listPage()
    },
    pageIndexChange: function (e) {
      this.searchModel.pageDto.currentPage = e
      this.listPage()
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
