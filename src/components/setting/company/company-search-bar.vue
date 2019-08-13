<template xmlns:v-data-dictionary-directive="http://www.w3.org/1999/xhtml">
  <div class="search">
    <div style="margin-bottom: 5px">
      <el-form :inline="true" label-width="150px"  size="small">
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
    <el-form :model="searchModel" label-width="150px"  size="small" v-bind:style="isCollapse ? 'display:block':'display:none'">
      <el-form-item label="公司名">
        <el-input v-model="searchModel.name"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <select class="form-control" v-data-dictionary-directive:1011 v-model="searchModel.type">
        </select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="searchModel.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'company-search-bar',
  data () {
    return {
      isCollapse: false,
      searchKey: '',
      searchModel: {
        pageDto: {
          showCount: 10, currentPage: 1, pageSizes: [10, 20, 30, 100]
        },
        name: '',
        type: '',
        description: ''
      }
    }
  },
  methods: {
    toggleCollapse: function () {
      this.isCollapse = !this.isCollapse
    },
    search: function () {
      let p = {isCollapse: this.isCollapse, searchKey: this.searchKey, searchModel: this.searchModel}
      this.$emit('search', p)
    }
  }
}
</script>

<style scoped>

</style>
