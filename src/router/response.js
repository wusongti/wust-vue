import Vue from 'vue'
import Router from 'vue-router'
import Response401 from '@/components/response/response-401.vue'
import Response404 from '@/components/response/response-404.vue'
import ResponseError from '@/components/response/response-error.vue'
import ResponseUndone from '@/components/response/response-undone.vue'

Vue.use(Router)

export default [
  {
    path: '/ResponseError',
    name: 'ResponseError',
    component: ResponseError
  },
  {
    path: '/ResponseUndone',
    name: 'ResponseUndone',
    component: ResponseUndone
  },
  {
    path: '/Response401',
    name: 'Response401',
    component: Response401
  },
  {
    path: '/Response404',
    name: 'Response404',
    component: Response404
  }
]
