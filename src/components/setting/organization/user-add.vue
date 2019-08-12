/**
* Created by WST on 2019/5/14.
*/
<template>
  <div id="user-add">
    <el-form :inline="true" label-position="right" @submit.native.prevent class="demo-form-inline" label-width="100px" size="mini">
      <el-form-item label="用户账号">
        <el-input v-model="searchModel.loginName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <table class="table table-hover table-bordered">
      <thead>
      <tr>
        <th width="100">用户账号</th>
        <th>真实姓名</th>
        <th>用户类型</th>
        <th width="60">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="data.id" v-for="data in baseDto.lstDto">
        <td>{{data.loginName}}</td>
        <td>
          {{data.realName}}
        </td>
        <td>
          {{data.typeLabel}}
        </td>
        <td>
          <button type="button" class="btn btn-link btn-xs" @click="onSubmit(data)" v-if="data.type != '100401'" :disabled="data.assigned != null && (data.type == '100402' || data.type == '100403' || data.type == '100406' || data.type == '100409')">选择</button>
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="5">
          <pagination-component v-bind:currentPage="searchModel.pageDto.currentPage"
                                v-bind:showCount="searchModel.pageDto.showCount"
                                v-bind:totalResult="baseDto.page.totalResult"
                                v-on:updatePageIndex="pageIndexChange"
                                @pageClick="listPage"></pagination-component>
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'

export default {
  name: 'UserAdd',
  components: {
    PaginationComponent
  },
  props: ['selectedNode'],
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        loginName: ''
      },
      baseDto: {page: {totalResult: 0}}
    }
  },
  created: function () {
    this.search()
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
    search: function () {
      this.searchModel.pageDto.currentPage = 1
      this.listPage()
    },
    onSubmit: function (data) {
      let d = {pid: this.selectedNode.id, type: '101115', relationId: data.id}
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/OrganizationController/create',
        data: d
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

          let name = data.realName
          let newNode = {id: res.data.obj, pId: this.selectedNode.id, name: name, type: '101115', relationId: data.id}
          this.addNode(newNode)
        }
      })
    },
    addNode: function (newNode) {
      this.$emit('addNode', newNode)
    }
  }
}
</script>
