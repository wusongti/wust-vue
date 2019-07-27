/**
* Created by WST on 2019/5/28.
*/
<template>
  <el-tabs  type="card" v-model="editableTabsValue">
    <el-tab-pane :name="defaultActiveName" label="默认数据字典">
      <lookup-list></lookup-list>
    </el-tab-pane>
  </el-tabs>
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
