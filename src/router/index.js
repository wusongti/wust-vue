import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index/index.vue'
import Login from '@/components/login/login.vue'
import Response204 from '@/components/response/response-204.vue'
import adminRouter from './admin'
import responseRouter from './response'

Vue.use(Router)

let routes = []

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Index',
      component: Index,
      children: routes.concat(adminRouter, responseRouter)
    },
    {
      path: '/Response204',
      name: 'Response204',
      component: Response204
    }
  ]
})
