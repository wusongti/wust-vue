/**
* Created by WST on 2019/5/30.
*/
<template>
  <div id="user-add">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>设置个性化数据</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="input1" class="required">属性名</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="input1" placeholder="属性名" v-model="updateModel.name"/>
              </div>
              <div class="col-xs-2 text-right">
                <label for="input3">排序</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="input3" placeholder="排序" v-model="updateModel.sort"/>
              </div>
            </div>
          </form>
        </div>
        <div class="submit-group">
          <button class="btn btn-danger btn-sm" @click="closePopover">取消</button>
          <button class="btn btn-primary btn-sm" @click="submit">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'LookupUpdate',
  props: ['selectModel'],
  data () {
    return {
      updateModel: {
        id: '',
        codd: '',
        parentCode: '',
        rootCode: '',
        name: '',
        value: '',
        description: '',
        lan: '',
        status: '',
        visible: '',
        sort: 0
      }
    }
  },
  created: function () {
    this.updateModel = this.selectModel
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopver', false)
    },
    submit: function () {
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.updateModel.name)) {
        this.$message('warning', '请输入属性名', 3000)
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/update',
        data: this.updateModel
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message('warning', res.data.message, 3000)
        } else {
          this.closePopover()
        }
      })
    }
  }
}
</script>
<style>
  @import "../../../assets/css/my-popover.css";
</style>
