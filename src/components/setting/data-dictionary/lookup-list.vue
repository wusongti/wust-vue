/**
* Created by WST on 2019/5/28.
*/
<template>
  <el-tabs  type="card" v-model="editableTabsValue"  @tab-click="clickTab">
    <el-tab-pane :name="defaultActiveName" label="数据字典">
      <el-container>
        <el-aside width="200px" style="min-height: 400px; border: 1px solid #eee">
          <ul id="tree" class="ztree"></ul>
        </el-aside>
        <el-main style="min-height: 400px;border-bottom:1px solid #eee;border-right: 1px solid #eee;border-top:1px solid #eee;">
          <table class="table table-hover table-bordered">
            <thead>
            <tr>
              <th width="200">属性名</th>
              <th width="150">属性码</th>
              <th>语言</th>
              <th>状态</th>
              <th>是否显示</th>
              <th>排序</th>
              <th width="150">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="data.id" v-for="data in baseDto.lstDto" v-bind:id="data.code" v-bind:pId="data.parentCode">
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
        </el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane name="LookupPrivateList" label="个性化">
     <lookup-private-list v-if="showLookupPrivateList"></lookup-private-list>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.core.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.excheck.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.exedit.js'
import LookupUpdate from './lookup-update'
import LookupCopy from './lookup-copy'
import LookupPrivateList from './lookup-private-list'

export default {
  components: {
    LookupPrivateList,
    PaginationComponent,
    LookupCopy,
    LookupUpdate},
  name: 'LookupList',
  data () {
    return {
      setting: {
        view: {
          showLine: true,
          fontCss: function (treeId, treeNode) {
            return (treeNode.highlight) ? {color: '#A60000', 'font-weight': 'bold'} : {
              color: '#333',
              'font-weight': 'normal'
            }
          }
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeClick: (treeId, treeNode, clickFlag) => {
            this.selectedNode = treeNode
            this.searchModel.parentCode = treeNode.id
            this.listPage()
          }
        }
      },
      selectedNode: {id: '', pid: '-1', rootCode: '', name: ''},
      searchHitZNodes: [],
      selectModel: {},
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        code: '',
        parentCode: '',
        name: '',
        visible: ''
      },
      baseDto: {page: {totalResult: 0}},
      defaultActiveName: 'LookupList',
      editableTabsValue: 'LookupList',
      showLookupPrivateList: false
    }
  },
  created: function () {
    this.initTree()
  },
  methods: {
    search: function () {
    },
    create: function (data) {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/DataDictionaryController/exist',
        data: data
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$confirm(res.data.message + ',您需要覆盖原来的数据吗？', '询问', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Vue.$ajax({
              method: 'post',
              url: Vue.$adminServerURL + '/DataDictionaryController/create',
              data: data
            }).then(res => {
              if (res.data.flag !== 'SUCCESS') {
                this.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              } else {
                this.$confirm('添加到个性化成功，是否转到个性化页面？', '询问', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                }).catch(() => {
                })
              }
            })
          }).catch(() => {
          })
        } else {
          Vue.$ajax({
            method: 'post',
            url: Vue.$adminServerURL + '/DataDictionaryController/create',
            data: data
          }).then(res => {
            if (res.data.flag !== 'SUCCESS') {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
            }
          })
        }
      })
    },
    initTree: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/LookupController/buildLookupTree',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag === 'SUCCESS') {
          let zNodes = JSON.parse(res.data.obj)
          // eslint-disable-next-line no-undef
          let treeObj = $.fn.zTree.init($('#tree'), this.setting, zNodes)

          if (this.selectedNode != null && this.selectedNode.id !== '') {
            this.expandParentNodes(this.selectedNode.children[0], treeObj)
            // eslint-disable-next-line no-undef
            $('#' + this.selectedNode.tId + '_a').click()
          } else {
            let nodes = treeObj.getNodes()
            if (nodes.length > 0) {
              // eslint-disable-next-line no-undef
              $('#tree_1_a').click()
            }
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 树搜索
    onSearch: function ($even) {
      let searchKeyWord = $even.currentTarget.value
      if (!Vue.$isNullOrIsBlankOrIsUndefined(searchKeyWord)) {
        this.updateHitZNodesStyle(false)
        // eslint-disable-next-line no-undef
        let treeObj = $.fn.zTree.getZTreeObj('tree')
        this.searchHitZNodes = treeObj.getNodesByParamFuzzy('name', searchKeyWord)
        if (this.searchHitZNodes != null) {
          this.updateHitZNodesStyle(true)

          /**
           * 展开搜索到的节点
           */
          for (let i = 0; i < this.searchHitZNodes.length; i++) {
            this.expandParentNodes(this.searchHitZNodes[i], treeObj)
          }
        }
      }
    },

    // 展开父节点
    expandParentNodes: function (treeNode, treeObj) {
      let parentNode = treeNode.getParentNode()
      if (parentNode != null) {
        treeObj.expandNode(parentNode, true, true, true)
      }
    },

    // 更新命中节点样式
    updateHitZNodesStyle: function (highlight) {
      // eslint-disable-next-line no-undef
      let treeObj = $.fn.zTree.getZTreeObj('tree')
      let nodeLength = this.searchHitZNodes.length
      for (let i = 0; i < nodeLength; i++) {
        this.searchHitZNodes[i].highlight = highlight
        treeObj.updateNode(this.searchHitZNodes[i])
      }
    },
    pageIndexChange: function (e) {
      this.searchModel.pageDto.currentPage = e
    },
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/LookupController/listPage',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        } else {
          this.baseDto = res.data
        }
      })
    },
    clickTab: function (tab) {
      if (tab.name === 'LookupList') {
        this.showLookupPrivateList = false
      } else {
        this.showLookupPrivateList = true
      }
    }
  }
}
</script>
<style>
  @import '../../../../static/zTree_v3.5.27/css/zTreeStyle.css';
</style>
