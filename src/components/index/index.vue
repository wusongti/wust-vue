<template>
  <div id="div-index">
  <!--最外层容器 start-->
  <el-container>
    <!--头部 start-->
    <el-header id="el-header" style="height: 45px">
      <el-row>
        <!--logo start-->
        <el-col :span="6" id="logo">
          <img src="../../assets/logo.png" class="pull-left"/>
          <a href="javascript:">智慧社区<span class="lite">云平台</span></a>
          <a href="javascript:" style="margin-top: 10px;margin-left:5px;color: #ffffff;font-size: 20px;"><li class="glyphicon glyphicon-menu-hamburger"  @click="collapseClick"></li></a>
        </el-col>
        <el-col :span="10" class="pull-left">
          &nbsp;
        </el-col>
        <!--logo end-->
        <el-col :span="3">
          <span style="color: #fed189">
            {{loginContext.getLoginContext().loginName}}({{loginContext.getLoginContext().realName}})
          </span>
        </el-col>
        <el-col :span="2">
          <el-dropdown trigger="click" class="pull-left" style="margin-left: 20px;">
            <span class="el-dropdown-link" style="color: #fed189">{{langValue}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a href="javascript:;" @click="changeLang('zh-CN')">中文</a></el-dropdown-item>
              <el-dropdown-item><a href="javascript:;" @click="changeLang('en-US')">English</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="2">
          <el-dropdown trigger="click" class="pull-left" style="margin-left: 20px;">
            <span class="el-dropdown-link" style="color: #fed189">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a href="javascript:;" v-on:click="logOut">注销</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <!--头部 end-->
    <!--下部分容器 start-->
    <el-container>
      <!--左侧菜单栏 start-->
      <el-aside id="el-aside" style="width: auto">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-index"
          @open="handleOpen"
          @close="handleClose"
          background-color="#394a59"
          text-color="#ececec"
          active-text-color="#ffd04b"
          :collapse="isCollapse">
          <el-menu-item index="-1" @click="toRight(dashboardMenu,'/Dashboard')">
            <i class="el-icon-s-home"></i>
            <span slot="title">{{dashboardMenu}}</span>
          </el-menu-item>
          <!-- 一级菜单，有子菜单 start -->
          <el-submenu :key="menu.code" :index="index + ''" v-for="(menu,index) in loginContext.getLoginContext().menus" v-if="menu.isParent == '100701'">
            <template slot="title">
              <i :class="menu.img"></i>
              <span>{{menu.description}}</span>
            </template>

            <!-- 二级菜单，有子菜单 start -->
            <el-submenu :key="child.code" :index="index + '-' + seq" v-for="(child,seq) in menu.children"  v-if="menu.code == child.pcode && child.isParent == '100701'">
              <template slot="title">
                <i :class="child.img"></i>
                {{child.description}}
              </template>

              <!-- 三级菜单，有子菜单 start -->
              <el-submenu :key="third.code" :index="index + '-' + (seq + k)" v-for="(third,k) in child.children"  v-if="child.code == third.pcode && third.isParent == '100701'">
                <template slot="title">
                  <i :class="third.img"></i>
                  {{third.description}}
                </template>
                <!-- TODO 四级菜单 -->
              </el-submenu>
              <!-- 三级菜单，有子菜单 end -->

              <!-- 三级菜单，无子菜单 start -->
              <el-menu-item :key="third.code" :index="index + '-' + (seq + k + 1)" v-for="(third,k) in child.children"  v-if="child.code == third.pcode && third.isParent == '100702'" @click="toRight(third.description,third.url)">
                <i :class="third.img"></i>
                <span slot="title">{{third.description}}</span>
              </el-menu-item>
              <!-- 三级菜单，无子菜单 end -->
            </el-submenu>
            <!-- 二级菜单，有子菜单 end -->

            <!-- 二级菜单，无子菜单 start -->
            <el-menu-item :key="child.code" :index="index + '-' + (seq + 1)" v-for="(child,seq) in menu.children"  v-if="menu.code == child.pcode && child.isParent == '100702'" @click="toRight(child.description,child.url)">
              <i :class="child.img"></i>
              <span slot="title">{{child.description}}</span>
            </el-menu-item>
            <!-- 二级菜单，无子菜单 end -->
          </el-submenu>
          <!-- 一级菜单，无子菜单 end -->

          <!-- 一级菜单，无子菜单 start -->
          <el-menu-item :key="menu.code" :index="(index + 1) + ''" v-for="(menu,index) in loginContext.getLoginContext().menus"  v-if="menu.isParent == '100702'" @click="toRight(menu.description,menu.url)">
            <i :class="menu.img"></i>
            <span slot="title">{{menu.description}} </span>
          </el-menu-item>
          <!-- 一级菜单，无子菜单 end -->

          <el-menu-item index="100">
            <i class="el-icon-s-help"></i>
            <span slot="title">系统帮助</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--左侧菜单栏 end-->
      <!--右边主体窗口 start-->
      <el-main id="el-main">
        <el-page-header  @back="goBack" :content="activeMenu" class="top-bar">
        </el-page-header>
        <div class="div-outer-router-view">
          <router-view/>
        </div>
      </el-main>
      <!--右边主体窗口 end-->
    </el-container>
    <!--下部分容器 end-->
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
      langValue: this.$i18n.locale === 'zh-CN' ? '中文' : 'English',
      dashboardMenu: '系统首页',
      activeMenu: this.activeMenu || this.dashboardMenu,
      isCollapse: false
    }
  },
  created: function () {
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    collapseClick: function () {
      this.isCollapse = !this.isCollapse
    },
    goBack: function () {
      this.$goBack()
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
            if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          }
        })
      }).catch(() => {
      })
    },
    toRight: function (menuName, link) {
      this.activeMenu = menuName
      this.$router.push({path: link})
    },
    changeLang: function (value) {
      this.langValue = value === 'zh-CN' ? '中文' : 'English'
      this.$i18n.locale = value // 如果不设置这个值，则需要刷新页面才看见效果
      localStorage.setItem('locale', value)
    }
  }
}
</script>

<style>
@import "index.css";
.el-page-header__content{
  font-size: 14px;
  color: #303133;
}

.el-menu-vertical-index:not(.el-menu--collapse) {
  width: 172px;
  min-height: 400px;
}
</style>
