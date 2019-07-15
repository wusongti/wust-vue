<template>
  <div id="company-list">
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
    <div class="row">
      <section class="panel">
        <div class="panel-body progress-panel">
          <div class="row">
            <div class="col-lg-8 task-progress pull-left">
              <h1>作业列表</h1>
            </div>
            <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
              <button type="button" class="btn btn-default" @click="create" v-has-permission="'JobList.create'"><span class="glyphicon glyphicon-plus" aria-hidden="true">新建</span></button>
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
            <tr v-for="data in baseDto.lstDto">
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
      </section>
    </div>
    <job-create v-if="showAddPopover" v-on:closePopover="closePopover('create')"></job-create>
    <job-update v-if="showUpdatePopover" v-on:closePopover="closePopover('update')" v-bind:selectedModel="selectedModel"></job-update>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import JobUpdate from './job-update'
import JobCreate from './job-create'

export default {
  name: 'JobList',
  components: {
    JobCreate,
    JobUpdate,
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
      selectedModel: {
        jobName: '',
        jobClassName: '',
        jobGroupName: '',
        cronExpression: ''
      }
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
    pause: function (data) {
      this.$dialog('询问', '您确定要暂停该作业吗？', true, true,
        () => { // 点击确定
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
              this.$message('warning', res.data.message, 3000)
            } else {
              this.search()
              this.$message('success', '操作成功', 3000)
            }
          })
        },
        () => { // 点击关闭

        }
      )
    },
    resume: function (data) {
      this.$dialog('询问', '您确定要恢复该作业吗？', true, true,
        () => { // 点击确定
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
              this.$message('warning', res.data.message, 3000)
            } else {
              this.search()
              this.$message('success', '操作成功', 3000)
            }
          })
        },
        () => { // 点击关闭

        }
      )
    },
    update: function (data) {
      this.selectedModel.jobName = data.qrtzJobDetails.jobName
      this.selectedModel.jobClassName = data.qrtzJobDetails.jobClassName
      this.selectedModel.jobGroupName = data.qrtzJobDetails.jobGroup
      this.selectedModel.cronExpression = data.qrtzCronTriggers.cronExpression
      if (this.showUpdatePopover) {
        this.showUpdatePopover = false
      } else {
        this.showUpdatePopover = true
      }
    },
    deleteJob: function (data) {
      this.$dialog('询问', '您确定删除该记录吗？', true, true,
        () => { // 点击确定
          Vue.$ajax({
            method: 'delete',
            url: Vue.$autotaskServerURL + '/JobController/delete/' + data.qrtzJobDetails.jobName + '/' + data.qrtzJobDetails.jobGroup
          }).then(res => {
            if (res.data.flag !== 'SUCCESS') {
              this.$message('warning', res.data.message, 3000)
            } else {
              this.$message('success', '成功', 3000)
              this.search()
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
