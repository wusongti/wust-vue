<template>
  <div>
    <el-tabs v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="项目列表">
        <project-search-bar v-on:search="search"></project-search-bar>
        <el-button-group class="pull-right" style="margin-bottom: 2px">
          <el-button size="mini" @click="create" v-has-permission="'ProjectList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></el-button>
          <el-button size="mini" v-export-excel-directive="exportExcelPar" v-has-permission="'ProjectList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></el-button>
        </el-button-group>
        <el-table
          border
          size="mini"
          :data="baseDto.lstDto">
          style="width: 100%">
          <el-table-column
            prop="code"
            label="编码"
            width="80">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="addr"
            label="项目地址"
            width="100">
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
              <button type="button" class="btn btn-link btn-xs" @click="update(scope.row)" v-has-permission="'ProjectList.update'">修改</button>
              <button type="button" class="btn btn-link btn-xs" @click="deleteById(scope.row.id)" v-has-permission="'ProjectList.delete'">删除</button>
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
import ProjectSearchBar from './project-search-bar'

export default {
  name: 'ProjectList',
  components: {
    ProjectSearchBar,
    ProjectUpdate,
    ProjectCreate,
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
