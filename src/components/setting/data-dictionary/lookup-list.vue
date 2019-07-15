/**
* Created by WST on 2019/5/28.
*/
<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div id="lookup-list">
    <!-- Nav tabs -->
    <ul id="myTabs" class="nav nav-tabs" role="tablist">
      <li role="presentation" class="active"><a href="#lookupList" aria-controls="lookupList" role="tab" data-toggle="tab" @click="changeTab('lookupList')">数据字典</a></li>
      <li role="presentation"><a href="#lookupIndividuationList" aria-controls="lookupIndividuationList" role="tab" data-toggle="tab" @click="changeTab('lookupIndividuationList')">个性化</a></li>
    </ul>
    <!-- Tab panes -->
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="lookupList">
        <form>
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="col-xs-2 form-group">
              <input type="text" class="form-control" placeholder="属性码" v-model="searchModel.code"/>
            </div>
            <div class="col-xs-2 form-group">
              <input type="text" class="form-control" placeholder="属性名" v-model="searchModel.name">
            </div>
            <div class="col-xs-2 form-group">
              <select class="form-control" v-data-dictionary-directive:1007 v-model="searchModel.visible">
              </select>
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
                <div class="col-lg-4">
                  <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
                  </div>
                </div>
              </div>
            </div>
            <table id="treeTable1" class="table table-hover table-bordered">
              <thead>
              <tr>
                <th width="350">属性名</th>
                <th width="250">属性码</th>
                <th>语言</th>
                <th>状态</th>
                <th>是否显示</th>
                <th>排序</th>
                <th width="150">操作</th>
              </tr>
              </thead>
                <tbody>
                   <tr v-for="data in baseDto.lstDto" v-bind:id="data.code" v-bind:pId="data.parentCode">
                      <td>
                        {{data.name}}
                      </td>
                      <td>
                        {{data.code}}
                      </td>
                      <td>
                        {{data.lan}}
                      </td>
                      <td>
                        {{data.statusLabel}}
                      </td>
                      <td>
                        {{data.visibleLabel}}
                      </td>
                      <td>
                        {{data.sort}}
                      </td>
                     <td>
                       <button type="button" class="btn btn-link btn-xs" @click="create(data)" v-if="data.rootCode == '0000'">添加到性化</button>
                     </td>
                    </tr>
                </tbody>
                <tfoot>
                </tfoot>
            </table>
          </section>
        </div>
      </div>
      <div role="tabpanel" class="tab-pane" id="lookupIndividuationList">
        <form>
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="col-xs-2 form-group">
              <input type="text" class="form-control" placeholder="属性码" v-model="searchModel.code"/>
            </div>
            <div class="col-xs-2 form-group">
              <input type="text" class="form-control" placeholder="属性名" v-model="searchModel.name">
            </div>
            <div class="col-xs-2 form-group">
              <select class="form-control" v-data-dictionary-directive:1007 v-model="searchModel.visible">
              </select>
            </div>
            <div>
              <button class="btn btn-danger btn-sm" type="reset">重置</button>
              <button class="btn btn-primary btn-sm" type="button" @click="search1">查询</button>
            </div>
          </div>
        </form>
        <div class="row">
          <section class="panel">
            <div class="panel-body progress-panel">
              <div class="row">
                <div class="col-lg-4">
                  <div class="btn-group pull-right btn-group-xs" role="group" aria-label="...">
                  </div>
                </div>
              </div>
            </div>
            <table id="treeTable2" class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="350">属性名</th>
                  <th width="250">属性码</th>
                  <th>语言</th>
                  <th>状态</th>
                  <th>是否显示</th>
                  <th>排序</th>
                  <th width="200">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in baseDto1.lstDto" v-bind:id="data.code" v-bind:pId="data.parentCode">
                  <td>
                    {{data.name}}
                  </td>
                  <td>
                    {{data.code}}
                  </td>
                  <td>
                    {{data.lan}}
                  </td>
                  <td>
                    {{data.statusLabel}}
                  </td>
                  <td>
                    {{data.visibleLabel}}
                  </td>
                  <td>
                    {{data.sort}}
                  </td>
                  <td>
                    <button type="button" class="btn btn-link btn-xs" @click="updateStatus(data)"><span v-if="data.status=='100201'">禁用</span><span v-if="data.status=='100202'">启用</span></button>
                    <button type="button" class="btn btn-link btn-xs" @click="updateVisible(data)"><span v-if="data.visible=='100701'">隐藏</span><span v-if="data.visible=='100702'">展示</span></button>
                    <!--<button type="button" class="btn btn-link btn-xs" @click="copy(data)" v-if="data.rootCode == '0000'">复制</button>-->
                    <button type="button" class="btn btn-link btn-xs" @click="update(data)">修改</button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
              </tfoot>
            </table>
          </section>
        </div>
      </div>
    </div>
    <lookup-update v-if="showUpdateIndividuationPopover" v-on:closePopver="closePopver('update')" v-bind:selectModel="selectModel"></lookup-update>
    <lookup-copy v-if="showCopyIndividuationPopover" v-on:closePopver="closePopver('copy')" v-bind:selectModel="selectModel"></lookup-copy>
  </div>
</template>
<script>
import Vue from 'vue'
import '../../../../static/treeTable/jquery.treeTable.js'
import LookupUpdate from './lookup-update'
import LookupCopy from './lookup-copy'

export default {
  components: {
    LookupCopy,
    LookupUpdate},
  name: 'LookupList',
  data () {
    return {
      showUpdateIndividuationPopover: false,
      showCopyIndividuationPopover: false,
      selectModel: {},
      searchModel: {
        code: '',
        name: '',
        visible: ''
      },
      searchModel1: {
        code: '',
        name: '',
        visible: ''
      },
      baseDto: {},
      baseDto1: {}
    }
  },
  created: function () {
    this.getLookupTableTreeData()
  },
  updated: function () {
    this.initTableTree1()
    this.initTableTree2()
  },
  methods: {
    showLookupTableTreePage: function () {
      $('#myTabs li:eq(1) a').tab('show')
      this.getLookupTableTreeData()
    },
    getLookupTableTreeData: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/getLookupTableTreeData',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          this.baseDto = res.data
        } else {
          this.$message('info', res.data.message, 3000)
        }
      })
    },
    showIndividuationLookupTableTreePage: function () {
      // eslint-disable-next-line no-undef
      $('#myTabs li:eq(1) a').tab('show')
      this.getIndividuationLookupTableTreeData()
    },
    getIndividuationLookupTableTreeData: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/getIndividuationLookupTableTreeData',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          this.baseDto1 = res.data
        } else {
          this.$message('info', res.data.message, 3000)
        }
      })
    },
    search: function () {
      this.getLookupTableTreeData()
    },
    search1: function () {
      this.getIndividuationLookupTableTreeData()
    },
    updateStatus: function (data) {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/updateStatus',
        data: data
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message('warning', res.data.message, 3000)
        } else {
          this.$message('success', '操作成功', 3000)
          this.getIndividuationLookupTableTreeData()
        }
      })
    },
    updateVisible: function (data) {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/updateVisible',
        data: data
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message('warning', res.data.message, 3000)
        } else {
          this.$message('success', '操作成功', 3000)
          this.getIndividuationLookupTableTreeData()
        }
      })
    },
    create: function (data) {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/exist',
        data: data
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$dialog('询问', res.data.message + ',您需要覆盖原来的数据吗？', true, true,
            () => { // 点击确定
              Vue.$ajax({
                method: 'post',
                url: Vue.$adminServerURL + '/DataDictionaryController/create',
                data: data
              }).then(res => {
                if (res.data.flag !== 'SUCCESS') {
                  this.$message('warning', res.data.message, 3000)
                } else {
                  this.$dialog('询问', '添加到个性化成功，是否转到个性化页面？', true, true,
                    () => { // 点击确定
                      this.showIndividuationLookupTableTreePage()
                    },
                    () => {
                      // 点击关闭
                    }
                  )
                }
              })
            },
            () => {
              // 点击关闭
            }
          )
        } else {
          Vue.$ajax({
            method: 'post',
            url: Vue.$adminServerURL + '/DataDictionaryController/create',
            data: data
          }).then(res => {
            if (res.data.flag !== 'SUCCESS') {
              this.$message('warning', res.data.message, 3000)
            } else {
              this.$dialog('询问', '添加到个性化成功，是否转到个性化页面？', true, true,
                () => { // 点击确定
                  this.showIndividuationLookupTableTreePage()
                },
                () => {
                  // 点击关闭
                }
              )
            }
          })
        }
      })
    },
    copy: function (data) {
      if (this.showCopyIndividuationPopover) {
        this.showCopyIndividuationPopover = false
      } else {
        this.selectModel = data
        this.showCopyIndividuationPopover = true
      }
    },
    update: function (data) {
      if (this.showUpdateIndividuationPopover) {
        this.showUpdateIndividuationPopover = false
      } else {
        this.selectModel = data
        this.showUpdateIndividuationPopover = true
      }
    },
    closePopver: function (type) {
      if (type === 'update') {
        this.showUpdateIndividuationPopover = false
        this.getIndividuationLookupTableTreeData()
      } else if (type === 'copy') {
        this.showCopyIndividuationPopover = false
      }
    },
    changeTab: function (tabId) {
      if (tabId === 'LookupList') {
        this.getLookupTableTreeData()
      } else {
        this.getIndividuationLookupTableTreeData()
      }
    },
    initTableTree1: function () {
      let option = {
        theme: 'vsStyle',
        expandLevel: 1,
        beforeExpand: function ($treeTable, id) {
          console.log('beforeExpand:' + id)
        },
        onSelect: function ($treeTable, id) {
          console.log('onSelect:' + id)
        }
      }
      $('#treeTable1').treeTable(option)
    },
    initTableTree2: function () {
      let option = {
        theme: 'vsStyle',
        expandLevel: 1,
        beforeExpand: function ($treeTable, id) {
          console.log('beforeExpand:' + id)
        },
        onSelect: function ($treeTable, id) {
          console.log('onSelect:' + id)
        }
      }
      // eslint-disable-next-line no-undef
      $('#treeTable2').treeTable(option)
    }
  }
}
</script>
<style>
</style>
