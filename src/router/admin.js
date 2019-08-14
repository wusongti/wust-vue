
import Dashboard from '@/components/dashboard/dashboard.vue'
import Response401 from '@/components/response/response-401.vue'
import Response404 from '@/components/response/response-404.vue'
import ResponseError from '@/components/response/response-error.vue'
import ResponseUndone from '@/components/response/response-undone.vue'
import CompanyList from '@/components/admin/setting/company/company-list.vue'
import DepartmentList from '@/components/admin/setting/department/department-list.vue'
import ProjectList from '@/components/admin/setting/project/project-list.vue'
import RoleList from '@/components/admin/setting/role/role-list.vue'
import UserList from '@/components/admin/setting/user/user-list.vue'
import OrganizationList from '@/components/admin/setting/organization/organization-list.vue'
import LookupIndex from '@/components/admin/setting/data-dictionary/lookup-index.vue'
import MyImportExportList from '@/components/admin/query/my-import-export/my-import-export-list.vue'
import OperationLogList from '@/components/admin/query/operation-log/operation-log-list.vue'
import JobList from '@/components/admin/query/job/job-list.vue'

export default [
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
    path: '/ProjectList',
    component: ProjectList
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
    path: '/LookupIndex',
    component: LookupIndex
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
    path: '/JobList',
    component: JobList
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
