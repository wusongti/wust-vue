/**
* Created by WST on 2019/5/28.
*/
<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 5px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>数据字典</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs  type="card" v-model="editableTabsValue">
      <el-tab-pane :name="defaultActiveName" label="数据字典">
        <lookup-list></lookup-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import LookupList from './lookup-list'

export default {
  components: {
    LookupList
  },
  name: 'LookupIndex',
  data () {
    return {
      defaultActiveName: 'LookupList',
      editableTabsValue: 'LookupList'
    }
  },
  created: function () {
  },
  methods: {
    search: function () {
    },
    create: function (data) {
    }
  }
}
</script>
