/**
 * Created by WST on 2019/5/6.
 */

let config = require('../../config')
let isProduction = process.env.NODE_ENV === 'production'
let isTesting = process.env.NODE_ENV === 'testing'

export const BASE_URL = isProduction ? config.build.BASE_URL : (isTesting ? config.test.BASE_URL : config.dev.BASE_URL)
export const ADMIN_SERVER_URL = isProduction ? (config.build.BASE_URL + '/api-admin-server') : (isTesting ? config.test.BASE_URL + '/api-admin-server' : config.dev.BASE_URL + '/api-admin-server')
export const SSO_SERVER_URL = isProduction ? (config.build.BASE_URL + '/api-sso-server') : (isTesting ? config.test.BASE_URL + '/api-sso-server' : config.dev.BASE_URL + '/api-sso-server')
export const AUTOTASK_SERVER_URL = isProduction ? (config.build.BASE_URL + '/api-autotask-server') : (isTesting ? config.test.BASE_URL + '/api-autotask-server' : config.dev.BASE_URL + '/api-autotask-server')
