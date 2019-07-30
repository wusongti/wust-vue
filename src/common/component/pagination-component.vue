<template>
  <div id="page">
    <nav aria-label="...">
      <ul class="pagination" style="text-align: center">
        <li v-bind:class="{'disabled':currentPage <= 1}">
          <a href="javascript:;" aria-label="Previous" v-on:click="pageClick(1)">
            <span aria-hidden="true">首页</span>
          </a>
        </li>
        <li v-bind:class="{'disabled':currentPage <= 1}">
          <a href="javascript:;" aria-label="Previous" v-on:click="prePage(),$emit('currentPage')">
            <span aria-hidden="true">上一页</span>
          </a>
        </li>
        <li  v-for="index in indexs"  v-bind:class="{ 'active': currentPage == index}">
          <a v-on:click="pageClick(index)">{{index}}</a>
        </li>
        <li v-bind:class="{'disabled':currentPage >= totalPage}">
          <a href="javascript:;" aria-label="Next" v-on:click="nextPage()">
            <span aria-hidden="true">下一页</span>
          </a>
        </li>
        <li v-bind:class="{'disabled':currentPage >= totalPage}">
          <a href="javascript:;" aria-label="Next" v-on:click="pageClick(totalPage)">
            <span aria-hidden="true">尾页</span>
          </a>
        </li>
        <li><span aria-hidden="true">每页{{showCount}}条记录，共{{totalResult}}条记录，共{{totalPage}}页</span></li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  props: ['currentPage', 'showCount', 'totalResult'],
  data () {
    return {
      totalPage: 0
    }
  },
  computed: {
    indexs: function () {
      return this.indexMethod()
    }
  },
  methods: {
    prePage: function () {
      let currentPageTemp = this.currentPage
      if (currentPageTemp <= 1) {
        return
      }

      currentPageTemp--
      this.$emit('updatePageIndex', currentPageTemp)
      this.$emit('pageClick')
    },
    nextPage: function (data = null) {
      let currentPageTemp = this.currentPage
      if (currentPageTemp >= this.totalPage) {
        return
      }

      currentPageTemp++
      this.$emit('updatePageIndex', currentPageTemp)
      this.$emit('pageClick')
    },
    pageClick: function (data = null) {
      let currentPageTemp = this.currentPage
      currentPageTemp = data
      this.$emit('updatePageIndex', currentPageTemp)
      this.$emit('pageClick')
    },
    indexMethod: function () {
      if (this.totalResult < 1) {
        this.totalPage = 0
      } else {
        if (this.totalResult % this.showCount === 0) {
          this.totalPage = parseInt(this.totalResult / this.showCount)
        } else {
          this.totalPage = parseInt(this.totalResult / this.showCount) + 1
        }
      }

      let currentPageTemp = this.currentPage
      let left = 1
      let right = this.totalPage
      let ar = []
      if (this.totalPage >= 5) {
        if (currentPageTemp > 3 && currentPageTemp < this.totalPage - 2) {
          left = currentPageTemp - 2
          right = currentPageTemp + 2
        } else {
          if (currentPageTemp <= 3) {
            left = 1
            right = 5
          } else {
            right = this.totalPage
            left = this.totalPage - 4
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    }
  }
}
</script>
