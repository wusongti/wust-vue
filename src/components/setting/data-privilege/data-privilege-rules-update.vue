/**
* Created by WST on 2019/6/11.
*/
<template>
  <div id="data-privilege-rules-update">
    <div class="my-popover">
      <div class="my-popover-box" style="width: 18%;height: 55%">
        <div class="my-popover-title">
          <label>更新数据权限规则</label>
          <a class="my-popover-close" @click="closePopover"><span class="glyphicon glyphicon-remove-circle"></span></a>
        </div>
        <div class="scroll-box">
          <form>
            <div class="radio">
              <label>
                <input type="radio" value="100905" name="typeRadio"  checked>
                本人可见
              </label>
            </div>
            <div class="radio">
              <label>
                <input type="radio" value="100910" name="typeRadio">
                岗位可见
              </label>
            </div>
            <div class="radio">
              <label>
                <input type="radio" value="100915" name="typeRadio">
                部门可见
              </label>
            </div>
            <div class="radio">
              <label>
                <input type="radio" value="100920" name="typeRadio">
                公司可见
              </label>
            </div>
            <div class="checkbox">
              <label>
                <input type="checkbox" value="100925" name="typeCheckbox">
                领导可见
              </label>
            </div>
          </form>
        </div>
        <div class="submit-group">
          <button class="btn btn-danger btn-sm" @click="closePopover">取消</button>
          <button class="btn btn-primary btn-sm" @click="doUpdate">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'DataPrivilegeRulesUpdate',
  props: ['selectedModel'],
  data () {
    return {
      typeRadio: '',
      typeCheckbox: ''
    }
  },
  created: function () {

  },
  methods: {
    closePopover: function () {
      this.$emit('closePopover', false)
    },
    doUpdate: function () {
      let that = this
      let typeStr = ''
      let typeRadios = document.getElementsByName('typeRadio')
      for (let k in typeRadios) {
        if (typeRadios[k].checked) {
          typeStr += typeRadios[k].value
          break
        }
      }

      let typeCheckboxs = document.getElementsByName('typeCheckbox')
      for (let k in typeCheckboxs) {
        if (typeCheckboxs[k].checked) {
          typeStr += ',' + typeCheckboxs[k].value
          break
        }
      }

      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataPrivilegeRulesController/update/' + that.selectedModel.dataPrivilegeId + '/' + typeStr
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
