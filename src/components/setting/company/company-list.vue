<template>
  <div id="company-list">
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
              <h1>公司列表</h1>
            </div>
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-default" @click="create" v-has-permission="'CompanyList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></button>
              <button type="button" class="btn btn-default" v-export-excel-directive="exportExcelPar" v-has-permission="'CompanyList.export'"><span class="glyphicon glyphicon-export" aria-hidden="true">导出</span></button>
            </div>
          </div>
        </div>
        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th>编码</th>
              <th>公司名称</th>
              <th>父级公司名称</th>
              <th>公司负责人</th>
              <th>描述</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>更新人</th>
              <th>最后更新时间</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in baseDto.lstDto">
              <td>{{data.code}}</td>
              <td>
                {{data.name}}
              </td>
              <td>
                {{data.pname}}
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
                <button type="button" class="btn btn-link btn-xs" @click="update(data)" v-has-permission="'CompanyList.update'">修改</button>
                <button type="button" class="btn btn-link btn-xs" @click="deleteById(data.id)" v-has-permission="'CompanyList.delete'">删除</button>
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
    <company-create v-if="showAddPopover" v-on:closePopover="closePopover('create')"></company-create>
    <company-update v-if="showUpdatePopover" v-on:closePopover="closePopover('update')" v-bind:selectedModel="selectedModel"></company-update>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import CompanyUpdate from './company-update'
import CompanyCreate from './company-create'

export default {
  name: 'CompanyList',
  components: {
    CompanyCreate,
    CompanyUpdate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        name: ''
      },
      baseDto: {page: {totalResult: 0}},
      showAddPopover: false,
      showUpdatePopover: false,
      selectedModel: {},
      exportExcelPar: {
        excelSuffix: 'xls',
        xmlName: 'admin_company',
        moduleName: 'company'}
    }
  },
  created: function () {
    this.listPage()
  },
  methods: {
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/CompanyController/listPage',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
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
    create: function () {
      if (this.showAddPopover) {
        this.showAddPopover = false
      } else {
        this.showAddPopover = true
      }
    },
    update: function (data) {
      this.selectedModel = data
      if (this.showUpdatePopover) {
        this.showUpdatePopover = false
      } else {
        this.showUpdatePopover = true
      }
    },
    deleteById: function (id) {
      this.$dialog('询问', '您确定删除该记录吗？', true, true,
        () => { // 点击确定
          Vue.$ajax({
            method: 'delete',
            url: Vue.$adminServerURL + '/CompanyController/delete/' + id
          }).then(res => {
            if (res.data.flag !== 'SUCCESS') {
              this.$message('warning', res.data.message, 3000)
            } else {
              this.$message('success', '成功', 3000)
              this.listPage()
            }
          })
        },
        () => { // 点击关闭

        }
      )
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
