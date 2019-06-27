module.exports = {
  proxy: {
    '**': {
      target: 'http://localhost:8766',
      secure: false, // 如果是https接口，需要配置这个参数
      changeOrigin: true //是否跨域
    }
  }
}
