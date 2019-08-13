/**
* Created by WST on 2019/5/28.
*/
<template>
  <div>
    <el-tabs>
      <el-tab-pane label="操作日志">
          <operation-log-search-bar v-on:search="search"></operation-log-search-bar>
        <el-table
          border
          size="mini"
          :data="baseDto.lstDto">
          style="width: 100%">
          <el-table-column
            prop="moduleName"
            label="模块"
            width="200">
          </el-table-column>
          <el-table-column
            prop="businessName"
            label="业务"
            width="200">
          </el-table-column>
          <el-table-column
            prop="operationType"
            label="操作类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="userRealName"
            label="操作用户"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作时间"
            width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operationIp"
            label="操作IP"
            width="180">
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
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import OperationLogSearchBar from './operation-log-search-bar'

export default {
  name: 'OprationLogList',
  components: {
    OperationLogSearchBar,
    PaginationComponent
  },
  data () {
    return {
      searchModel: {
        pageDto: {
          showCount: 10, currentPage: 1, pageSizes: [10, 20, 30, 100]
        },
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
    pageSizeChange: function (e) {
      this.searchModel.pageDto.showCount = e
      this.listPage()
    },
    pageIndexChange: function (e) {
      this.searchModel.pageDto.currentPage = e
      this.listPage()
    },
    search: function (p) {
      if (!p.isCollapse) { // 非高级查询，则只需要根据关键字查询
        if (!Vue.$isNullOrIsBlankOrIsUndefined(p.searchKey)) {
          this.searchModel.moduleName = p.searchKey
        }
      } else {
        this.searchModel = p.searchModel
      }
      this.searchModel.pageDto.currentPage = 1
      this.listPage()
    }
  }
}
</script>
