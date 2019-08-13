<template>
  <div>
    <el-tabs v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="用户列表">
        <user-search-bar v-on:search="search"></user-search-bar>
        <el-button-group class="pull-right" style="margin-bottom: 2px">
          <el-button size="mini" @click="create" v-has-permission="'UserList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></el-button>
          <el-button size="mini" v-file-download-directive="'user_template.xls'"><span class="glyphicon glyphicon-download" aria-hidden="true">模板下载</span></el-button>
          <el-button size="mini" @click="importByExcel" v-has-permission="'UserList.import'"><span class="glyphicon glyphicon-import" aria-hidden="true">导入</span></el-button>
          <el-button size="mini" v-export-excel-directive="exportExcelPar" v-has-permission="'UserList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></el-button>
        </el-button-group>
        <el-table
          border
          size="mini"
          :data="baseDto.lstDto">
          style="width: 100%">
          <el-table-column
            prop="loginName"
            label="登录账号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="realName"
            label="真实姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系电话"
            width="100">
          </el-table-column>
          <el-table-column
            prop="typeLabel"
            label="用户类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="sexLabel"
            label="性别"
            width="80">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="80">
          </el-table-column>
          <el-table-column
            prop="statusLabel"
            label="状态"
            width="80">
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
              <button type="button" class="btn btn-link btn-xs" @click="update(scope.row)" v-has-permission="'UserList.update'">修改</button>
              <button type="button" class="btn btn-link btn-xs" @click="deleteById(scope.row.id)" v-has-permission="'UserList.delete'">删除</button>
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
        <user-create v-if="item.key == 'create'"></user-create>
        <user-update v-if="item.key == 'update'" v-bind:selectedModel="selectedModel"></user-update>
        <user-import v-if="item.key == 'import'"></user-import>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import UserCreate from './user-create'
import UserUpdate from './user-update'
import UserImport from './user-import'
import UserSearchBar from './user-search-bar'

export default {
  name: 'UserList',
  components: {
    UserSearchBar,
    UserImport,
    UserCreate,
    UserUpdate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        loginName: '',
        realName: '',
        sex: '',
        email: '',
        type: '',
        status: ''
      },
      baseDto: {page: {totalResult: 0}},
      selectedModel: {},
      exportExcelPar: {
        fileType: 'xls',
        xmlName: 'admin_user',
        moduleName: 'user'
      },
      defaultActiveName: 'UserList',
      editableTabsValue: 'UserList',
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
        url: Vue.$adminServerURL + '/UserController/listPage',
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
    search: function (p) {
      if (!p.isCollapse) { // 非高级查询，则只需要根据关键字查询
        if (!Vue.$isNullOrIsBlankOrIsUndefined(p.searchKey)) {
          this.searchModel.loginName = p.searchKey
        }
      } else {
        this.searchModel = p.searchModel
      }
      this.searchModel.pageDto.currentPage = 1
      this.listPage()
    },
    create: function () {
      this.addTab('新建用户', 'CreateUser', 'create')
    },
    update: function (data) {
      this.selectedModel = data
      this.addTab('修改用户', 'UpdateUser', 'update')
    },
    deleteById: function (id) {
      this.$confirm('您确定删除该记录吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$adminServerURL + '/UserController/delete/' + id
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
    importByExcel: function () {
      this.addTab('导入用户', 'ImportUser', 'import')
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
