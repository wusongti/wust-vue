<template>
  <!-- container section start -->
  <section id="container" v-bind:class="{'sidebar-closed': isCloseSidebar }">
    <header class="header dark-bg">
      <div class="toggle-nav">
        <div class="icon-reorder tooltips" data-original-title="Toggle Navigation" data-placement="bottom"><i class="icon_menu" v-on:click="closeSidebar"></i></div>
      </div>

      <!--logo start-->
      <a href="index.html" class="logo">基于微服务架构下的企业<span class="lite">基础平台</span></a>
      <!--logo end-->

      <div class="nav search-row" id="top_menu">
        <!--  search form start -->
        <ul class="nav top-menu">
          <li>
            <form class="navbar-form">
              <input class="form-control" placeholder="Search" type="text">
            </form>
          </li>
        </ul>
        <!--  search form end -->
      </div>

      <div class="top-nav notification-row">
        <!-- notificatoin dropdown start-->
        <ul class="nav pull-right top-menu">
          <!-- user login dropdown start-->
          <li class="dropdown" v-bind:class="{ open: personalPanelIsOpen }" v-on:click="openPersonalPanel">
            <a data-toggle="dropdown" class="dropdown-toggle" href="javascript:;">
              <span class="username">{{loginContext.getLoginContext().loginName}}</span>
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu extended logout">
              <div class="log-arrow-up"></div>
              <li>
                <a href="javascript:;"><i class="icon_mail_alt"></i>我的消息</a>
              </li>
              <li v-on:click="dialogFormVisible = true">
                <a href="javascript:;"><i class="icon_cursor_alt"></i>切换语言</a>
              </li>
              <li v-on:click="logOut">
                <a href="javascript:;"><i class="icon_key_alt"></i>登出</a>
              </li>
            </ul>
          </li>
          <!-- user login dropdown end -->
        </ul>
        <!-- notificatoin dropdown end-->
      </div>
    </header>
    <!--header end-->

    <!--sidebar start-->
    <aside>
      <div id="sidebar" class="nav-collapse ">
        <!-- sidebar menu start-->
        <ul class="sidebar-menu">
          <li class="active" @click="toRight('/Dashboard')">
            <a class="" href="javascript:;">
              <i class="icon_house_alt"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li class="sub-menu" v-for="menu in loginContext.getLoginContext().oneLevelMenus">
            <a href="javascript:;" class="" v-on:click="openSubMenu($event,menu.id)">
              <i class="icon_documents_alt"></i>
              <span>{{menu.description}}</span>
              <span class="menu-arrow arrow_carrot-down arrow_carrot-right"></span>
            </a>
            <ul class="sub">
              <li v-for="sub in twoLevelMenus" @click="toRight(sub.url)"><a class="" href="javascript:;">{{sub.description}}</a></li>
            </ul>
          </li>
        </ul>
        <!-- sidebar menu end-->
      </div>
    </aside>
    <!--sidebar end-->

    <!--main content start-->
    <section id="main-content">
      <section class="wrapper">
        <!-- 导航条 start-->
        <div class="row">
          <div class="col-lg-12">
            <ol class="breadcrumb">
              <li><i class="fa fa-home"></i><a href="index.html">Home</a></li>
              <li><i class="fa fa-laptop"></i>Dashboard</li>
            </ol>
          </div>
        </div>
        <!-- 导航条 end-->

        <!-- 内容 start -->
        <router-view/>
        <!-- 内容 end -->
      </section>
      <div class="text-right">
        <div class="credits">
          ©2019 本系统所有权限归系统开发者WUST解释
        </div>
      </div>

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
    </section>
    <!--main content end-->
  </section>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'Index',
  data () {
    return {
      isCloseSidebar: false,
      personalPanelIsOpen: false,
      twoLevelMenus: [],
      dialogFormVisible: false,
      langValue: this.$i18n.locale
    }
  },
  methods: {
    closeSidebar: function () {
      if (this.isCloseSidebar) {
        this.isCloseSidebar = false
      } else {
        this.isCloseSidebar = true
      }
    },
    openPersonalPanel: function () {
      if (this.personalPanelIsOpen) {
        this.personalPanelIsOpen = false
      } else {
        this.personalPanelIsOpen = true
      }
    },
    openSubMenu: function (event, menuId) {
      let className = event.target.parentElement.lastElementChild.className
      if (className === 'menu-arrow arrow_carrot-down arrow_carrot-right') { // 展开子菜单
        // 先关闭已经打开的菜单的样式
        let arrowCarrotDowns = document.querySelectorAll('.menu-arrow.arrow_carrot-down')
        if (arrowCarrotDowns != null && arrowCarrotDowns.length > 0) {
          for (let i = 0; i < arrowCarrotDowns.length; i++) {
            let arrowCarrotDown = arrowCarrotDowns[i]
            arrowCarrotDown.className = 'menu-arrow arrow_carrot-down arrow_carrot-right'
          }
        }

        // 先关闭已经打开的子菜单的样式
        let subBlocks = document.querySelectorAll('.sub')
        if (subBlocks != null && subBlocks.length > 0) {
          for (let i = 0; i < subBlocks.length; i++) {
            let subBlock = subBlocks[i]
            subBlock.style.overflow = 'hidden'
            subBlock.style.display = 'none'
          }
        }

        // 取消其他菜单的选中状态(class='active')
        /* let classNameActives = document.querySelectorAll('li.active');
            if(classNameActives != null && classNameActives.length > 0){
              let classNameActive = classNameActives[0];
              classNameActive.className = '';
            }

            let liClassName = event.target.parentElement.className;
            if(liClassName.indexOf('active') == -1){
                if(liClassName.trim() == ''){
                  event.target.parentElement.className = 'active';
                }else{
                  event.target.parentElement.className = event.target.parentElement.className + ' active';
                }
            } */

        Vue.$ajax({
          method: 'post',
          url: Vue.$ssoServerURL + '/ResourcesController/loadSubMenuById/' + this.loginContext.getLoginContext().loginName + '/' + menuId
        }).then(res => {
          if (res.data.flag === 'SUCCESS') {
            this.twoLevelMenus = res.data.obj
            event.target.parentElement.lastElementChild.className = 'menu-arrow arrow_carrot-down'
            event.target.parentElement.parentElement.lastElementChild.style.overflow = 'hidden'
            event.target.parentElement.parentElement.lastElementChild.style.display = 'block'
          } else {
            if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
              this.$message(res.data.message)
            }
          }
        })
      } else if (className === 'menu-arrow arrow_carrot-down') { // 关闭子菜单
        event.target.parentElement.lastElementChild.className = 'menu-arrow arrow_carrot-down arrow_carrot-right'
        event.target.parentElement.parentElement.lastElementChild.style.overflow = 'hidden'
        event.target.parentElement.parentElement.lastElementChild.style.display = 'none'
      }
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
      this.langValue = localStorage.getItem('locale') || 'zh-CN'
      if (this.langValue === 'zh-CN') {
        this.langValue = 'en-US'
        this.$i18n.locale = this.langValue
      } else {
        this.langValue = 'zh-CN'
        this.$i18n.locale = this.langValue
      }
      localStorage.setItem('locale', this.langValue)
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
  @import "../../assets/css/elegant-icons-style.css";
  @import "index.css";
</style>
