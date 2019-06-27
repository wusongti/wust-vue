/**
 * 登录上下文，可通过该类设置和获取当前登录用户的上下文信息，上下文信息会存储在session里面
 * @author wust
 * @type {{loginContextModel: {loginName: string, oneLevelMenus: Array, permissions: Array, xAuthToken: string}, setLoginContext: loginContext.setLoginContext, getLoginContext: loginContext.getLoginContext}}
 */
let loginContext = {
  setLoginContext: function (p) {
    var obj = p.data.obj;

    var loginContextModel = {
      loginName:obj.loginName,
        oneLevelMenus : obj.oneLevelMenus,
        permissions : obj.permissions,
        xAuthToken : obj.xAuthToken
    };

    sessionStorage.setItem("x-auth-token",obj.xAuthToken);
    sessionStorage.setItem("loginContextModel",JSON.stringify(loginContextModel));
  },
  getLoginContext: function () {
    var loginContextSession = sessionStorage.getItem('loginContextModel');
    if(loginContextSession == undefined || loginContextSession == null || loginContextSession == ''){
      this.$router.push({path:'/Login'});
    }else{
      return JSON.parse(loginContextSession);
    }
    return loginContextSession;
  },
  removeLoginContext:function () {
    sessionStorage.removeItem("x-auth-token");
    sessionStorage.removeItem("loginContextModel");
  }
}

export default loginContext;
