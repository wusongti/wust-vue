import LoginContext from '../login-context'

/**
 * Created by WST on 2019/5/15.
 */
let directivePlugin = {
  install: function (Vue, options) {
    Vue.directive('data-dictionary-directive', {
      bind (el, binding, vnode, oldVnode) {
        if (Vue.$isNullOrIsBlankOrIsUndefined(binding.value)) {
          let url = Vue.$adminServerURL + '/DataDictionaryController/getLookupListByParentCode/' + binding.arg + '/null'
          appendToEL(Vue, el, url)
        } else {
          let url = Vue.$adminServerURL + '/DataDictionaryController/getLookupListByParentCode/' + binding.arg + '/' + binding.value
          appendToEL(Vue, el, url)
        }
      },
      update (el, binding, vnode, oldVnode) {
        // TODO 实现级联

      }
    })

    // 下载本地文件指令
    Vue.directive('file-download-directive', {
      bind (el, binding, vnode, oldVnode) {
        el.onclick = function () {
          if (!Vue.$isNullOrIsBlankOrIsUndefined(binding.value)) {
            let value = binding.value.replace(/"/g, '')
            let dire = value.substring(value.lastIndexOf('.') + 1)
            window.location.href = './static/download/' + dire + '/' + value
          }
        }
      }
    })

    // 导出excel指令
    Vue.directive('export-excel-directive', {
      bind (el, binding, vnode, oldVnode) {
        el.onclick = () => {
          if (!Vue.$isNullOrIsBlankOrIsUndefined(binding.value)) {
            Vue.$ajax({
              method: 'post',
              url: Vue.$adminServerURL + '/ExportExcelController/exportExcel',
              data: binding.value
            }).then(res => {
              vnode.context.$confirm('导出完成，需要跳转到结果页面吗？', '询问', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                vnode.context.$router.push({path: '/MyImportExportList'})
              }).catch(() => {
              })
            })
          }
        }
      }
    })

    // 是否有权限指令：控制显示与隐藏
    Vue.directive('has-permission', {
      bind (el, binding, vnode, oldVnode) {
        el.style.display = 'none'

        let ps = LoginContext.getLoginContext().permissions
        if (!Vue.$isNullOrIsBlankOrIsUndefined(ps)) {
          for (let i = 0; i < ps.length; i++) {
            if (ps[i] === binding.value) {
              el.style.display = 'inline'
              break
            }
          }
        }
      }
    })

    // 是否有权限指令：控制可用状态
    Vue.directive('has-permission-disable', {
      bind (el, binding, vnode, oldVnode) {
        el.disabled = true

        let ps = LoginContext.getLoginContext().permissions
        if (!Vue.$isNullOrIsBlankOrIsUndefined(ps)) {
          for (let i = 0; i < ps.length; i++) {
            if (ps[i] === binding.value) {
              el.disabled = false
              break
            }
          }
        }
      }
    })
  }
}

export default directivePlugin

function appendToEL (Vue, el, url) {
  Vue.$ajax({
    method: 'post',
    url: url
  }).then(res => {
    if (res.data.flag === 'SUCCESS') {
      el.innerHTML = res.data.t
    } else {
      if (!Vue.$isNullOrIsBlankOrIsUndefined(res.data.message)) {
        this.$message({
          message: res.data.message,
          type: 'warning'
        })
      }
    }
  })
}
