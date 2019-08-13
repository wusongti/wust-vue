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
      <el-table
        border
        size="mini"
        :data="baseDto.lstDto">
        style="width: 100%">
        <el-table-column
          prop="name"
          label="属性名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="code"
          label="属性码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="parentCode"
          label="父级编码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="rootCode"
          label="根编码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="lan"
          label="语言"
          width="100">
        </el-table-column>
        <el-table-column
          prop="statusLabel"
          label="状态"
          width="50">
        </el-table-column>
        <el-table-column
          prop="visibleLabel"
          label="是否显示"
          width="70">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="50">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <button type="button" class="btn btn-link btn-xs" @click="update(scope.row)" v-has-permission="'CompanyList.update'">修改</button>
            <button type="button" class="btn btn-link btn-xs" @click="deleteById(scope.row.id)" v-has-permission="'CompanyList.delete'">删除</button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageIndexChange"
        :current-page="searchModel.pageDto.currentPage"
        :page-sizes="searchModel.pageDto.pageSizes"
        :page-size="searchModel.pageDto.showCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="baseDto.page.totalResult">
      </el-pagination>
    </el-main>
  </el-container>
</template>
<script>
import Vue from 'vue'
import '../../../../../static/zTree_v3.5.27/js/jquery.ztree.core.js'
import '../../../../../static/zTree_v3.5.27/js/jquery.ztree.excheck.js'
import '../../../../../static/zTree_v3.5.27/js/jquery.ztree.exedit.js'
export default {
  components: {
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
        pageDto: {showCount: 10, currentPage: 1, pageSizes: [10, 20, 30, 100]},
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
        data: {}
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
          if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
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
    pageSizeChange: function (e) {
      this.searchModel.pageDto.showCount = e
      this.listPage()
    },
    pageIndexChange: function (e) {
      this.searchModel.pageDto.currentPage = e
      this.listPage()
    },
    listPage: function () {
      Vue.$ajax({
        method: 'post',
        url: Vue.$adminServerURL + '/LookupController/listPage',
        data: this.searchModel
      }).then(res => {
        if (res.data.flag !== 'SUCCESS') {
          if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        } else {
          this.baseDto = res.data
        }
      })
    }
  }
}
</script>
<style>
  @import '../../../../../static/zTree_v3.5.27/css/zTreeStyle.css';
</style>
