/**
* Created by WST on 2019/5/14.
*/
<template>
  <div id="company-add">
    <el-form :inline="true" label-position="right" @submit.native.prevent class="demo-form-inline" label-width="100px" size="mini">
      <el-form-item label="角色名">
        <el-input v-model="searchModel.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <table class="table table-hover table-bordered">
      <thead>
      <tr>
        <th width="60">编码</th>
        <th>名称</th>
        <th width="60">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="data.id" v-for="data in baseDto.lstDto">
        <td>{{data.code}}</td>
        <td>
          {{data.name}}
        </td>
        <td>
          <button type="button" class="btn btn-link btn-xs" @click="onSubmit(data)">选择</button>
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
  name: 'RoleAdd',
  components: {
    PaginationComponent
  },
  props: ['selectedNode'],
  data () {
    return {
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        name: ''
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
        url: Vue.$adminServerURL + '/RoleController/listPage',
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
      let d = {pid: this.selectedNode.id, type: '101113', relationId: data.id}
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

          let name = '角色-' + data.name
          let newNode = {id: res.data.obj, pId: this.selectedNode.id, name: name, type: '101113', relationId: data.id}
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
