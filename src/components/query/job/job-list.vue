<template>
  <div>
    <el-tabs v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="作业列表">
      <job-search-bar v-on:search="search"></job-search-bar>
        <el-table
          border
          size="mini"
          :data="baseDto.lstDto">
          style="width: 100%">
          <el-table-column
            prop="qrtzJobDetails.jobName"
            label="作业名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="qrtzJobDetails.jobClassName"
            label="作业类名称"
            width="350">
          </el-table-column>
          <el-table-column
            prop="qrtzJobDetails.jobGroup"
            label="组"
            width="100">
          </el-table-column>
          <el-table-column
            prop="qrtzCronTriggers.cronExpression"
            label="表达式"
            width="180">
          </el-table-column>
          <el-table-column
            prop="qrtzCronTriggers.timeZoneId"
            label="时区"
            width="100">
          </el-table-column>
          <el-table-column
            prop="qrtzTriggers.triggerState"
            label="状态"
            width="100">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <button type="button" class="btn btn-link btn-xs" @click="pause(scope.row)" v-has-permission="'JobList.update'" v-if="scope.row.qrtzTriggers.triggerState == 'WAITING'">暂停</button>
              <button type="button" class="btn btn-link btn-xs" @click="resume(scope.row)" v-has-permission="'JobList.update'" v-if="scope.row.qrtzTriggers.triggerState == 'PAUSED'">恢复</button>
              <button type="button" class="btn btn-link btn-xs" @click="update(scope.row)" v-has-permission="'JobList.update'">修改</button>
              <button type="button" class="btn btn-link btn-xs" @click="deleteJob(scope.row)" v-has-permission="'JobList.delete'">删除</button>
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
        <job-update v-if="item.key == 'update'" v-bind:selectedModel="selectedModel"></job-update>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import JobUpdate from './job-update'
import JobSearchBar from './job-search-bar'

export default {
  name: 'JobList',
  components: {
    JobSearchBar,
    JobUpdate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1, pageSizes: [10, 20, 30, 100]},
        name: ''
      },
      baseDto: {page: {totalResult: 0}},
      selectedModel: {
        jobName: '',
        jobClassName: '',
        jobGroupName: '',
        cronExpression: ''
      },
      defaultActiveName: 'JobList',
      editableTabsValue: 'JobList',
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
        url: Vue.$autotaskServerURL + '/JobController/listPage',
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
      if (p === null) {
        this.searchModel.pageDto.currentPage = 1
        this.listPage()
      } else {
        if (!p.isCollapse) { // 非高级查询，则只需要根据关键字查询
          if (!Vue.$isNullOrIsBlankOrIsUndefined(p.searchKey)) {
            this.searchModel.name = p.searchKey
          }
        } else {
          this.searchModel = p.searchModel
        }
        this.searchModel.pageDto.currentPage = 1
        this.listPage()
      }
    },
    pause: function (data) {
      this.$confirm('您确定要恢复该作业吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'post',
          url: Vue.$autotaskServerURL + '/JobController/pause',
          data: {
            jobName: data.qrtzJobDetails.jobName,
            jobClassName: data.qrtzJobDetails.jobClassName,
            jobGroupName: data.qrtzJobDetails.jobGroup,
            cronExpression: data.qrtzCronTriggers.cronExpression
          }
        }).then(res => {
          if (res.data.flag !== 'SUCCESS') {
            if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '成功',
              type: 'success'
            })
            this.search(null)
          }
        })
      }).catch(() => {
      })
    },
    resume: function (data) {
      this.$confirm('您确定要恢复该作业吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'post',
          url: Vue.$autotaskServerURL + '/JobController/resume',
          data: {
            jobName: data.qrtzJobDetails.jobName,
            jobClassName: data.qrtzJobDetails.jobClassName,
            jobGroupName: data.qrtzJobDetails.jobGroup,
            cronExpression: data.qrtzCronTriggers.cronExpression
          }
        }).then(res => {
          if (res.data.flag !== 'SUCCESS') {
            if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
              if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
                this.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            }
          } else {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.search(null)
          }
        })
      }).catch(() => {
      })
    },
    update: function (data) {
      this.selectedModel.jobName = data.qrtzJobDetails.jobName
      this.selectedModel.jobClassName = data.qrtzJobDetails.jobClassName
      this.selectedModel.jobGroupName = data.qrtzJobDetails.jobGroup
      this.selectedModel.cronExpression = data.qrtzCronTriggers.cronExpression
      this.addTab('编辑作业', 'UpdateJob', 'update')
    },
    deleteJob: function (data) {
      this.$confirm('您确定删除该记录吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'delete',
          url: Vue.$autotaskServerURL + '/JobController/delete/' + data.qrtzJobDetails.jobName + '/' + data.qrtzJobDetails.jobGroup
        }).then(res => {
          if (res.data.flag !== 'SUCCESS') {
            if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.search(null)
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
              this.search(null)
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    clickTab: function (tab) {
      if (tab.name === this.defaultActiveName) {
        this.search(null)
      }
    }
  }
}
</script>
