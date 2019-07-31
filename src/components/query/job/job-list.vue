<template>
  <div>
    <el-tabs  type="card" v-model="editableTabsValue"  @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane :name="defaultActiveName" label="作业列表">
      <form>
        <div class="row">
          <div class="col-xs-2 form-group">
            <input type="text" class="form-control" placeholder="作业名" v-model="searchModel.name"/>
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
            <th width="200">作业名称</th>
            <th>作业类名称</th>
            <th width="50">组</th>
            <th width="100">表达式</th>
            <th width="50">时区</th>
            <th width="50">状态</th>
            <th width="200">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="data.id" v-for="data in baseDto.lstDto">
            <td>
              {{data.qrtzJobDetails.jobName}}
            </td>
            <td>
              {{data.qrtzJobDetails.jobClassName}}
            </td>
            <td>
              {{data.qrtzJobDetails.jobGroup}}
            </td>
            <td>
              {{data.qrtzCronTriggers.cronExpression}}
            </td>
            <td>
              {{data.qrtzCronTriggers.timeZoneId}}
            </td>
            <td>
              {{data.qrtzTriggers.triggerState}}
            </td>
            <td>
              <button type="button" class="btn btn-link btn-xs" @click="pause(data)" v-has-permission="'JobList.update'" v-if="data.qrtzTriggers.triggerState == 'WAITING'">暂停</button>
              <button type="button" class="btn btn-link btn-xs" @click="resume(data)" v-has-permission="'JobList.update'" v-if="data.qrtzTriggers.triggerState == 'PAUSED'">恢复</button>
              <button type="button" class="btn btn-link btn-xs" @click="update(data)" v-has-permission="'JobList.update'">修改</button>
              <button type="button" class="btn btn-link btn-xs" @click="deleteJob(data)" v-has-permission="'JobList.delete'">删除</button>
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
        <job-update v-if="item.key == 'update'" v-bind:selectedModel="selectedModel"></job-update>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import JobUpdate from './job-update'

export default {
  name: 'JobList',
  components: {
    JobUpdate,
    PaginationComponent},
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
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
    pageIndexChange: function (e) {
      this.searchModel.pageDto.currentPage = e
    },
    search: function () {
      this.searchModel.pageDto.currentPage = 1
      this.listPage()
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
            this.search()
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
            this.search()
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
            this.search()
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
