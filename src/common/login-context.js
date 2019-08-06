/**
 * 登录上下文，可通过该类设置和获取当前登录用户的上下文信息，上下文信息会存储在session里面
 * @author wust
 * @type {{loginContextModel: {loginName: string, oneLevelMenus: Array, permissions: Array, xAuthToken: string}, setLoginContext: loginContext.setLoginContext, getLoginContext: loginContext.getLoginContext}}
 */
let loginContext = {
  setLoginContext: function (p) {
    let obj = p.data.obj

    let loginContextModel = {
      loginName: obj.loginName,
      realName: obj.realName,
      menus: obj.menus,
      permissions: obj.permissions,
      xAuthToken: obj.xAuthToken
    }

    sessionStorage.setItem('x-auth-token', obj.xAuthToken)
    sessionStorage.setItem('loginContextModel', JSON.stringify(loginContextModel))
  },
  getLoginContext: function () {
    let loginContextSession = sessionStorage.getItem('loginContextModel')
    if (loginContextSession === undefined || loginContextSession == null || loginContextSession === '') {
      this.$router.push({path: '/Login'})
    } else {
      return JSON.parse(loginContextSession)
    }
    return loginContextSession
  },
  removeLoginContext: function () {
    console.log('登录信息失效，清空前端sesssion')
    sessionStorage.removeItem('x-auth-token')
    sessionStorage.removeItem('loginContextModel')
    console.log('登录信息失效，清空前端sesssion后x-auth-token=' + sessionStorage.getItem('x-auth-token'))
    console.log('登录信息失效，清空前端sesssion后loginContextModel=' + sessionStorage.getItem('loginContextModel'))
  }
}

export default loginContext
