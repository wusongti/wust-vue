/**
 * Created by WST on 2019/4/17.
 */

import axios from 'axios'
import router from '../../router/index'
import LoginContext from '../login-context'

axios.interceptors.request.use(config => {
  config.headers['x-auth-token'] = sessionStorage.getItem('x-auth-token')
  config.headers['x-locale'] = localStorage.getItem('locale')
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (response.status === 200) {
    if (response.config.url.indexOf('logout') !== -1) { // 登出
      LoginContext.removeLoginContext()
    }
  } else {
    if (response.status === 204) {
      router.push({path: '/Response204'})
    } else if (response.status === 401) {
      router.push({path: '/Response401'})
    } else if (response.status === 404) {
      router.push({path: '/Response404'})
    } else {
      router.push({path: '/ResponseError'})
    }
  }
  return response
}, error => {
  if (error.response !== undefined && error.response != null) {
    if (error.response.status === 204) {
      router.push({path: '/Response204'})
    } else if (error.response.status === 401) {
      router.push({path: '/Response401'})
    } else if (error.response.status === 404) {
      router.push({path: '/Response404'})
    } else {
      router.push({path: '/ResponseError'})
    }
  } else {
    router.push({path: '/ResponseError'})
  }
  return Promise.reject(error)
})
