/**
* Created by WST on 2019/5/30.
*/
<template xmlns:data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div id="user-add">
    <div class="my-popover">
      <div class="my-popover-box">
        <div class="my-popover-title">
          <label>复制个性化数据</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="input1" class="required">属性名</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="input1" placeholder="属性名" v-model="dataModel.name"/>
              </div>
              <div class="col-xs-2 text-right">
                <label>语言</label>
              </div>
              <div class="form-group col-xs-3">
                <select class="form-control" data-dictionary-directive:1008="dataModel.lan"  v-model="dataModel.lan">
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2 text-right">
                <label for="input3">排序</label>
              </div>
              <div class="form-group col-xs-3">
                <input type="text" class="form-control" id="input3" placeholder="排序" v-model="dataModel.sort"/>
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
  name: 'LookupCopy',
  props: ['selectModel'],
  data () {
    return {
      dataModel: {
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
    this.dataModel = this.selectModel
  },
  methods: {
    closePopover: function () {
      this.$emit('closePopver', false)
    },
    submit: function () {
      if (Vue.$isNullOrIsBlankOrIsUndefined(this.dataModel.name)) {
        this.$message('warning', '请输入属性名', 3000)
        return
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/copy',
        data: this.dataModel
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
