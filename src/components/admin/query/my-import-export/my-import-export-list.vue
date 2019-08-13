/**
* Created by WST on 2019/5/23.
*/
<template>
  <div>
    <el-tabs>
      <el-tab-pane label="我的导入导出">
       <my-import-export-search-bar v-on:search="search"></my-import-export-search-bar>
        <el-table
          border
          size="mini"
          :data="baseDto.lstDto">
          style="width: 100%">
          <el-table-column
            prop="batchNo"
            label="编码"
            width="120">
          </el-table-column>
          <el-table-column
            prop="moduleName"
            label="模块名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="operationTypeLabel"
            label="操作类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="statusLabel"
            label="状态"
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
            label="开始时间时间"
            width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.startTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="结束时间"
            width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.endTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
              <button type="button" class="btn btn-link btn-xs" @click="viewLog(scope.row.msg)" v-has-permission="'MyImportExportList.download'">查看日志</button>
              <button type="button" class="btn btn-link btn-xs" @click="downloadExcel(scope.row.batchNo)" v-has-permission="'MyImportExportList.download'" :disabled="scope.row.operationType == '100601'">下载文件</button>
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
    </el-tabs>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <p>{{logText}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import MyImportExportSearchBar from './my-import-export-search-bar'

export default {
  name: 'ImportExportList',
  components: {
    MyImportExportSearchBar
  },
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1, pageSizes: [10, 20, 30, 100]},
        status: ''
      },
      baseDto: {page: {totalResult: 0}},
      dialogVisible: false,
      logText: ''
    }
  },
  created: function () {
    this.listPage()
  },
  methods: {
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/MyImportExportController/listPage',
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
    downloadExcel: function (id) {
      window.location.href = Vue.$adminServerURL + '/MyImportExportController/downloadFile?x-auth-token=' + this.loginContext.getLoginContext().xAuthToken + '&relationId=' + id + '&relationField=excel'
    },
    viewLog: function (msg) {
      this.logText = msg
      this.dialogVisible = true
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
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
