/**
* Created by WST on 2019/5/14.
*/
<template>
  <div id="company-add">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>添加用户</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-5 form-group">
                <input type="text" class="form-control" placeholder="用户账号" v-model="searchModel.loginName"/>
              </div>
              <div>
                <button class="btn btn-primary btn-sm" type="button" @click="search">查询</button>
              </div>
            </div>
          </form>
          <section class="panel">
            <div class="panel-body progress-panel">
              <div class="row">
                <div class="col-lg-8 task-progress pull-left">
                  <h1>用户列表</h1>
                </div>
                <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
                </div>
              </div>
            </div>
            <table class="table table-hover table-bordered">
              <thead>
              <tr>
                <th>用户账号</th>
                <th>真实姓名</th>
                <th>描述</th>
                <th width="140">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="data in baseDto.lstDto">
                <td>{{data.loginName}}</td>
                <td>
                  {{data.realName}}
                </td>
                <td>
                  {{data.description}}
                </td>
                <td>
                  <button type="button" class="btn btn-link btn-xs" @click="doAdd(data)" v-if="data.type != '100401'">选择</button>
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
          </section>
        </div>
        <div class="submit-group">
          <button class="btn btn-danger btn-sm" @click="closePopover">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import PaginationComponent from '../../../common/component/pagination-component.vue'

  export default {
    name: 'UserAdd',
    components: {
      PaginationComponent
    },
    props: ['selectedNode'],
    data(){
      return {
        searchModel:{
          pageDto:{showCount:10,currentPage:1},
          loginName:''
        },
        baseDto:{page:{totalResult:0}},
      }
    },
    created:function () {
      this.listPage();
    },
    methods:{
      listPage:function () {
        Vue.$ajax({
          method: 'post',
          url:Vue.$adminServerURL + '/UserController/listPage',
          data:this.searchModel
        }).then(res => {
          if(res.data.messageMap.flag == 'SUCCESS') {
            this.baseDto = res.data;
          }else{
            this.$message('info',res.data.message,3000);
          }
        })
      },
      pageIndexChange:function (e) {
        this.searchModel.pageDto.currentPage = e;
      },
      search:function () {
        this.searchModel.pageDto.currentPage = 1;
        this.listPage();
      },
      closePopover:function () {
        this.$emit('closePopver', false);
      },
      doAdd:function (data) {
        let d = {pid:this.selectedNode.id,type:'sys_user',relationId:data.id};
        Vue.$ajax({
          method: 'post',
          url:Vue.$adminServerURL + '/OrganizationController/create',
          data:d
        }).then(res => {
          if(res.data.flag != 'SUCCESS') {
            this.$message('warning',res.data.message,3000);
          }else{
            this.closePopover();
          }
        })
      }
    }
  }
</script>
<style>
  @import "../../../assets/css/my-popover.css";
</style>
