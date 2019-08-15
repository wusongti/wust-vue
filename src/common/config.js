/**
 * Created by WST on 2019/5/6.
 */

let config = require('../../config')
let isProduction = process.env.NODE_ENV === 'production'
export const BASE_URL = isProduction ? config.build.BASE_URL : config.dev.BASE_URL
export const ADMIN_SERVER_URL = isProduction ? config.build.ADMIN_SERVER_URL : config.dev.ADMIN_SERVER_URL
export const SSO_SERVER_URL = isProduction ? config.build.SSO_SERVER_URL : config.dev.SSO_SERVER_URL
export const AUTOTASK_SERVER_URL = isProduction ? config.build.AUTOTASK_SERVER_URL : config.dev.AUTOTASK_SERVER_URL
