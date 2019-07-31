import axios from 'axios'
import MessageComponent from '../component/message-component.vue'
import DialogComponent from '../component/dialog-component.vue'

const Config = require('../config.js')
/**
 * Created by WST on 2019/5/15.
 */
let universalPlugin = {
  install: function (Vue, options) {
    // 全局属性：baseUrl
    Vue.$baseURL = Config.BASE_URL

    // 全局属性：ADMIN_SERVER_URL
    Vue.$adminServerURL = Config.ADMIN_SERVER_URL

    // 全局属性：SSO_SERVER_URL
    Vue.$ssoServerURL = Config.SSO_SERVER_URL

    // 全局属性：AUTOTASK_SERVER_URL
    Vue.$autotaskServerURL = Config.AUTOTASK_SERVER_URL

    // 全局属性：ajax
    Vue.$ajax = axios

    // 实例方法：返回
    Vue.prototype.$goBack = function () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }

    // 全局静态方法：去空
    Vue.$trim = function (v) {
      return (v + '').replace(/(^\s+)|(\s+$)/g, '')
    }

    // 全局静态方法：空白判断
    Vue.$isBlank = function (v) {
      if (Vue.$trim(v) === '') {
        return true
      }
      return false
    }

    // 全局静态方法：null判断
    Vue.$isNull = function (v) {
      if (v == null) {
        return true
      }

      if (Vue.$trim(v).toLowerCase() === 'null') {
        return true
      }
      return false
    }

    // 全局静态方法：空白判断
    Vue.$isUndefined = function (v) {
      if (v === undefined) {
        return true
      }

      if (Vue.$trim(v).toLowerCase() === 'undefined') {
        return true
      }
      return false
    }

    // 全局静态方法：isNull,isBlank,isUndefined组合
    Vue.$isNullOrIsBlankOrIsUndefined = function (v) {
      if (Vue.$isNull(v)) {
        return true
      }

      if (Vue.$isBlank(v)) {
        return true
      }

      if (Vue.$isUndefined(v)) {
        return true
      }
      return false
    }

    // 全局静态方法：密码格式判断
    Vue.$isPassword = function (v) {
      let reg = /^[0-9a-zA-Z_]{1,}$/
      if (reg.test(v)) {
        return v
      }
    }

    // 全局静态方法：日期格式判断
    Vue.$isDate = function (v) {
      // eslint-disable-next-line no-useless-escape
      let reg = /^((\d{4})[\-|\.|\/](\d{1,2})[\-|\.|\/](\d{1,2}))?$/
      if (reg.test(v)) {
        return v
      }
    }

    // 全局静态方法：日期格式判断
    Vue.$isEmail = function (v) {
      let reg = /^(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)?$/
      if (reg.test(v)) {
        return v
      }
    }

    // 全局静态方法：数字判断
    Vue.$isNumber = function (v) {
      // eslint-disable-next-line no-useless-escape
      let reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/
      if (reg.test(v)) {
        return v
      }
    }

    // 全局静态方法：移动电话判断
    Vue.$isMobile = function (v) {
      let reg = /^(0?1[358]\d{9})*$/
      if (reg.test(v)) {
        return v
      }
    }

    // 全局静态方法：格式化日期
    Vue.$formatDate = function (date, fmt) {
      if (Vue.$isNullOrIsBlankOrIsUndefined(date)) {
        return null
      }

      let v = date
      if (!(v instanceof Date)) {
        v = new Date(date)
      }

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (v.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': v.getMonth() + 1,
        'd+': v.getDate(),
        'h+': v.getHours(),
        'm+': v.getMinutes(),
        's+': v.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
        }
      }
      return fmt
    }

    /** ********************** 警告框 S ****************************/
    // 生成一个Vue的子类
    let MessageComponentConstructor = Vue.extend(MessageComponent)
    let messageComponentConstructorInstance = new MessageComponentConstructor()

    // 将这个实例挂载在div上
    messageComponentConstructorInstance.$mount(document.createElement('div'))

    // 并将此div加入最顶层的body里面
    document.body.appendChild(messageComponentConstructorInstance.$el)

    Vue.prototype.$message = (type, msg, duration = 5000) => {
      messageComponentConstructorInstance.message = msg
      messageComponentConstructorInstance.messageType = type
      setTimeout(() => {
        messageComponentConstructorInstance.messageType = ''
      }, duration)
    }
    /** ********************** 警告框 E ****************************/

    /** ********************** 对话框 S ****************************/
    // 生成一个Vue的子类
    let DialogComponentConstructor = Vue.extend(DialogComponent)
    let dialogComponentConstructorInstance = new DialogComponentConstructor()

    // 将这个实例挂载在div上
    dialogComponentConstructorInstance.$mount(document.createElement('div'))

    // 并将此div加入最顶层的body里面
    document.body.appendChild(dialogComponentConstructorInstance.$el)

    Vue.prototype.$dialog = (title, message, showOKButton, showCancelButton, fnOK, fnCancel) => {
      dialogComponentConstructorInstance.title = title
      dialogComponentConstructorInstance.message = message
      dialogComponentConstructorInstance.showOKButton = showOKButton
      dialogComponentConstructorInstance.showCancelButton = showCancelButton
      dialogComponentConstructorInstance.showDialog = true
      dialogComponentConstructorInstance.fnOK = fnOK
      dialogComponentConstructorInstance.fnCancel = fnCancel
    }
    /** ********************** 对话框 E ****************************/
  }
}
export default universalPlugin
