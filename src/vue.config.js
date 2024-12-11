module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://43.138.175.43:8836',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/ahpFirstData/analyse'
        }
      }
    }
  }
}
