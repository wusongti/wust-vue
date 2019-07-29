/**
* Created by WST on 2019/5/28.
*/
<template>
  <el-container>
    <el-aside width="200px" style="min-height: 400px; border: 1px solid #eee">
      <el-form @submit.native.prevent>
        <el-input size="mini" @keyup.enter.native="onSearch">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form>
      <ul id="tree" class="ztree"></ul>
    </el-aside>
    <el-main style="min-height: 400px;border-bottom:1px solid #eee;border-right: 1px solid #eee;border-top:1px solid #eee;">
      <table class="table table-hover table-bordered">
        <thead>
        <tr>
          <th width="200">属性名</th>
          <th width="100">属性码</th>
          <th width="100">父级编码</th>
          <th width="100">根编码</th>
          <th>语言</th>
          <th>状态</th>
          <th>是否显示</th>
          <th>排序</th>
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
            {{data.parentCode}}
          </td>
          <td>
            {{data.rootCode}}
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
</template>
<script>
import Vue from 'vue'
import PaginationComponent from '../../../common/component/pagination-component.vue'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.core.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.excheck.js'
import '../../../../static/zTree_v3.5.27/js/jquery.ztree.exedit.js'
export default {
  components: {
    PaginationComponent
  },
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
      searchModel: {
        pageDto: {showCount: 10, currentPage: 1},
        code: '',
        parentCode: '',
        name: '',
        visible: ''
      },
      baseDto: {page: {totalResult: 0}}
    }
  },
  created: function () {
    this.initTree()
  },
  methods: {
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
      let searchKeyWord = $even.target.value
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
    }
  }
}
</script>
<style>
  @import '../../../../static/zTree_v3.5.27/css/zTreeStyle.css';
</style>
