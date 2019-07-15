import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Index from '@/components/index/index.vue'
import Dashboard from '@/components/dashboard/dashboard.vue'
import Response204 from '@/components/response/response-204.vue'
import Response401 from '@/components/response/response-401.vue'
import Response404 from '@/components/response/response-404.vue'
import ResponseError from '@/components/response/response-error.vue'
import ResponseUndone from '@/components/response/response-undone.vue'
import CompanyList from '@/components/setting/company/company-list.vue'
import DepartmentList from '@/components/setting/department/department-list.vue'
import RoleList from '@/components/setting/role/role-list.vue'
import UserList from '@/components/setting/user/user-list.vue'
import OrganizationList from '@/components/setting/organization/organization-list.vue'
import LookupList from '@/components/setting/data-dictionary/lookup-list.vue'
import MyImportExportList from '@/components/query/my-import-export/my-import-export-list.vue'
import OperationLogList from '@/components/query/operation-log/operation-log-list.vue'
import JobList from '@/components/query/job/job-list.vue'
import DataSourceList from '@/components/setting/data-source/datasource-list.vue'
import AppTokenList from '@/components/setting/apptoken/apptoken-list.vue'
import DataPrivilegeRulesList from '@/components/setting/data-privilege/data-privilege-rules-list.vue'

Vue.use(Router)

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
      children: [
        {
          path: '',
          redirect: '/Dashboard'
        },
        {
          path: '/Dashboard',
          component: Dashboard
        },
        {
          path: '/CompanyList',
          component: CompanyList
        },
        {
          path: '/DepartmentList',
          component: DepartmentList
        },
        {
          path: '/RoleList',
          component: RoleList
        },
        {
          path: '/UserList',
          component: UserList
        },
        {
          path: '/OrganizationList',
          component: OrganizationList
        },
        {
          path: '/LookupList',
          component: LookupList
        },
        {
          path: '/MyImportExportList',
          component: MyImportExportList
        },
        {
          path: '/OperationLogList',
          component: OperationLogList
        },
        {
          path: '/AppTokenList',
          component: AppTokenList
        },
        {
          path: '/DataPrivilegeRulesList',
          component: DataPrivilegeRulesList
        },
        {
          path: '/JobList',
          component: JobList
        },
        {
          path: '/DataSourceList',
          component: DataSourceList
        }
      ]
    },
    {
      path: '/Response204',
      name: 'Response204',
      component: Response204
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
    },
    {
      path: '/ResponseError',
      name: 'ResponseError',
      component: ResponseError
    },
    {
      path: '/ResponseUndone',
      name: 'ResponseUndone',
      component: ResponseUndone
    }
  ]
})
