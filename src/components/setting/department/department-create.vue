/**
* Created by WST on 2019/5/14.
*/
<template>
  <div id="department-create">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>新建部门</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label class="required">部门名</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="部门名" v-model="addModel.name"/>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label>父级部门</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="父部门" v-model="addModel.pname"/>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label>部门负责人</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" placeholder="部门负责人" v-model="addModel.leader"/>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label>描述</label>
              </div>
              <div class="form-group col-xs-6">
                <textarea class="form-control" rows="3" v-model="addModel.description"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="submit-group">
          <button class="btn btn-danger btn-sm" @click="closePopover">取消</button>
          <button class="btn btn-primary btn-sm" @click="doAdd">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';

  export default {
    name: 'DepartmentCreate',
    data(){
      return {
          addModel:{
            pname:'',
            name:'',
            leader:'',
            description:''
          }
      }
    },
    methods:{
        closePopover:function () {
          this.$emit('closePopover', false);
        },
        doAdd:function () {
            if(Vue.$isNullOrIsBlankOrIsUndefined(this.addModel.name)){
              this.$message('warning','请输入部门名称',3000);
              return;
            }

            Vue.$ajax({
              method: 'post',
              url:Vue.$adminServerURL + '/DepartmentController/create',
              data:this.addModel
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
