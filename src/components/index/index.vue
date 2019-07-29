<template>
  <div id="div_index">
  <!--最外层容器 start-->
  <el-container>
    <!--头部 start-->
    <el-header id="el-header">
      <!--logo start-->
      <a href="index.html" class="logo">基于微服务架构下的企业<span class="lite">基础平台</span></a>
      <!--logo end-->
      <el-col :span="12" class="pull-right">
        <el-dropdown trigger="click" class="pull-right">
          <span class="el-dropdown-link" style="color: #fed189">
            {{loginContext.getLoginContext().loginName}}({{loginContext.getLoginContext().realName}})<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><a href="javascript:;" v-on:click="dialogFormVisible = true">切换语言</a></el-dropdown-item>
            <el-dropdown-item><a href="javascript:;" v-on:click="logOut">注销</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-header>
    <!--头部 end-->
    <!--下部分容器 start-->
    <el-container>
      <!--左侧菜单栏 start-->
      <el-aside id="el-aside" width="190px">
        <el-menu
          :default-active="defaultActive"
          @open="handleOpen"
          @close="handleClose"
          background-color="#394a59"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="-1" @click="toRight('/Dashboard')">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页 </span>
          </el-menu-item>
          <!-- 一级菜单，有子菜单 start -->
          <el-submenu :key="menu.id" :index="index + ''" v-for="(menu,index) in loginContext.getLoginContext().menus" v-if="menu.children != null && menu.children.length > 0">
            <template slot="title">
              <i :class="menu.img"></i>
              <span>{{menu.description}}</span>
            </template>

            <!-- 二级菜单，有子菜单 start -->
            <el-submenu :key="child.id" :index="index + '-' + seq" v-for="(child,seq) in menu.children"  v-if="menu.id == child.pId && child.children != null && child.children.length > 0">
              <i></i>
              <template slot="title">{{child.description}}</template>
              <!-- TODO -->
            </el-submenu>
            <!-- 二级菜单，有子菜单 end -->

            <!-- 二级菜单，无子菜单 start -->
            <el-menu-item :key="child.id" :index="index + '-' + (seq + 1)" v-for="(child,seq) in menu.children"  v-if="menu.id == child.pId && child.children == null || child.children.length == 0" @click="toRight(child.url)">
              <i></i>
              <span slot="title">{{child.description}}</span>
            </el-menu-item>
            <!-- 二级菜单，无子菜单 end -->
          </el-submenu>
          <!-- 一级菜单，无子菜单 end -->

          <!-- 一级菜单，无子菜单 start -->
          <el-menu-item :key="menu.id" :index="(index + 1) + ''" v-for="(menu,index) in loginContext.getLoginContext().menus"  v-if="menu.children == null || menu.children.length == 0" @click="toRight(menu.url)">
            <i :class="menu.img"></i>
            <span slot="title">{{menu.description}} </span>
          </el-menu-item>
          <!-- 一级菜单，无子菜单 end -->

          <el-menu-item :index="(index + 2) + ''">
            <i class="el-icon-s-help"></i>
            <span slot="title">系统帮助</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--左侧菜单栏 end-->
      <!--右边主体窗口 start-->
      <el-main id="el-main">
        <router-view/>
      </el-main>
      <!--右边主体窗口 end-->
    </el-container>
    <!--下部分容器 end-->
    <!--切换语言弹出框 start-->
    <el-dialog title="切换语言" :visible.sync="dialogFormVisible" width="25%">
      <el-form >
        <el-form-item label="当前语言">
          <el-select  v-model="langValue" placeholder="请选择语言">
            <el-option label="中文（简体）" value="zh-CN"></el-option>
            <el-option label="英文（美国）" value="en-US"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeLang">确 定</el-button>
      </div>
    </el-dialog>
    <!--切换语言弹出框 end-->
  </el-container>
  <!--最外层容器 end-->
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'Index',
  data () {
    return {
      defaultActive: '-1',
      dialogFormVisible: false,
      langValue: this.$i18n.locale
    }
  },
  created: function () {
    this.langValue = localStorage.getItem('locale') || 'zh-CN'
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    logOut: function () {
      this.$confirm('您确定要退出登录吗, 是否继续?', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.$ajax({
          method: 'post',
          url: Vue.$ssoServerURL + '/LogoutController/logout/' + this.loginContext.getLoginContext().loginName
        }).then(res => {
          if (res.data.flag === 'SUCCESS') {
            this.$router.push({path: '/Login'})
          } else {
            this.$message(res.data.message)
          }
        })
      }).catch(() => {
      })
    },
    toRight: function (link) {
      this.$router.push({path: link})
    },
    changeLang: function () {
      this.$i18n.locale = this.langValue // 如果不设置这个值，则需要刷新页面才看见效果
      localStorage.setItem('locale', this.langValue)
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
@import "index.css";
</style>
