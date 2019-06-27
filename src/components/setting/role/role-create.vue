/**
* Created by WST on 2019/5/14.
*/
<template>
  <div id="role-create">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>新建角色</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputName" class="required">角色名</label>
              </div>
              <div class="form-group col-xs-6">
                <input type="text" class="form-control" id="inputName" placeholder="角色名" v-model="addModel.name"/>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="inputDescription">描述</label>
              </div>
              <div class="form-group col-xs-6">
                <textarea class="form-control" rows="3" id="inputDescription" v-model="addModel.description"></textarea>
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
    name: 'RoleCreate',
    data(){
      return {
          addModel:{
            code:'',
            name:'',
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
              this.$message('warning','请输入角色名称',3000);
              return;
            }

            Vue.$ajax({
              method: 'post',
              url:Vue.$adminServerURL + '/RoleController/create',
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
