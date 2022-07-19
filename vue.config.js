const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/vc': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    },
  }
}