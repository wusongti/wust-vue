<template>
  <div class="search">
    <div style="margin-bottom: 5px">
      <el-form :inline="true" label-width="150px" size="small" @submit.prevent>
        <el-form-item label="查询关键字">
          <el-input size="small" v-model="searchKey">
            <el-button slot="append" @click="toggleCollapse" :icon="isCollapse ? 'el-icon-remove-outline':'el-icon-circle-plus-outline'">高级</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search"><li class="el-icon-search">查询</li></el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-form :model="searchModel" label-width="150px"  size="small" v-bind:style="isCollapse ? 'display:block':'display:none'" @submit.prevent>
      <el-form-item label="模块名">
        <el-input v-model="searchModel.moduleName"></el-input>
      </el-form-item>
      <el-form-item label="业务名">
        <el-input v-model="searchModel.businessName"></el-input>
      </el-form-item>
      <el-form-item label="操作类型">
        <select class="form-control"  v-model="searchModel.operationType">
          <option value="" selected>--请选择--</option>
          <option value="新增">新增</option>
          <option value="修改">修改</option>
          <option value="删除">删除</option>
          <option value="查询">查询</option>
          <option value="保存">保存</option>
          <option value="上传">上传</option>
          <option value="下载">下载</option>
          <option value="导入">导入</option>
          <option value="导出">导出</option>
          <option value="登录">登录</option>
          <option value="登出">登出</option>
        </select>
      </el-form-item>
      <el-form-item label="操作日期">
        <el-date-picker
          v-model="operationDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'operation-log-search-bar',
  data () {
    return {
      isCollapse: false,
      searchKey: '',
      operationDate: '',
      searchModel: {
        pageDto: {
          showCount: 10, currentPage: 1, pageSizes: [10, 20, 30, 100]
        },
        moduleName: '',
        businessName: '',
        operationType: '',
        beginOperationDate: '',
        endOperationDate: ''
      }
    }
  },
  methods: {
    toggleCollapse: function () {
      this.isCollapse = !this.isCollapse
    },
    search: function () {
      if (!Vue.$isNullOrIsBlankOrIsUndefined(this.operationDate)) {
        this.searchModel.beginOperationDate = this.operationDate[0]
        if (this.operationDate.length > 1) {
          this.searchModel.endOperationDate = this.operationDate[1]
        }
      }

      let p = {isCollapse: this.isCollapse, searchKey: this.searchKey, searchModel: this.searchModel}
      this.$emit('search', p)
    }
  }
}
</script>

<style scoped>

</style>
