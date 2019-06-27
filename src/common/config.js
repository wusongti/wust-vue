/**
 * Created by WST on 2019/5/6.
 */

var config = require('../../config')
var isProduction = process.env.NODE_ENV === 'production'
export const BASE_URL = isProduction ? config.build.BASE_URL : config.dev.BASE_URL
export const ADMIN_SERVER_URL = isProduction ? config.build.BASE_URL + '/api-admin-server' : config.dev.BASE_URL + '/api-admin-server'
export const SSO_SERVER_URL = isProduction ? config.build.BASE_URL + '/api-sso-server' : config.dev.BASE_URL + '/api-sso-server'
export const AUTOTASK_SERVER_URL = isProduction ? config.build.BASE_URL + '/api-autotask-server' : config.dev.BASE_URL + '/api-autotask-server'
