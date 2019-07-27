<template>
  <!--最外层容器 start-->
  <el-container>
    <!--头部 start-->
    <el-header>
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
      <el-aside width="190px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#394a59"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项1</el-menu-item>
            <el-menu-item index="1-3">选项1</el-menu-item>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--左侧菜单栏 end-->
      <!--右边主体窗口 start-->
      <el-main>Main</el-main>
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
</template>
<script>
import Vue from 'vue'

export default {
  name: 'Index',
  data () {
    return {
      isCollapse: true,
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
      this.$i18n.locale = this.langValue // 如果不设置这个值，则需要刷新页面才看见效果
      localStorage.setItem('locale', this.langValue)
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
  .el-header {
    background: rgba(54,66,74,1);
    border-bottom: 1px solid #f1f2f7;
    text-color: #fff;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #394a59;
    text-color: #fff;
    min-height: 500px;
  }

  .el-main {
    text-align: center;
    min-height: 500px;
  }

  body > .el-container {
    margin-bottom: 10px;
  }

  a.logo {
    font-size: 28px;
    font-weight: 300;
    color: #fed189;
    float: left;
    margin-top: 5px;
    text-transform: uppercase;
  }

  a.logo:hover, a.logo:focus {
    text-decoration: none;
    outline: none;
  }

  a.logo span {
    color: #688a7e;
  }

  .lite{
    color: #00a0df !important;
  }
</style>
