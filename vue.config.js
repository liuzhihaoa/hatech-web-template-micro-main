const Path = require('path')
const { SvgChainConfig } = require('hatech-web-component-icon/src/utils')
const mockApiUrl = 'http://localhost:6666'

/**
 * 设置绝对路径
 * @param {String} dir 路径
 */
function resolve(dir) {
  return Path.join(__dirname, dir)
}

const routeBase = '/'

module.exports = {
  publicPath: routeBase,
  outputDir: 'dist' + routeBase,
  devServer: {
    port: 9190,
    proxy: {
      '/api': {
        target: mockApiUrl,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  },
  chainWebpack: chainConfig => {
    chainConfig.resolve.alias.set('@', resolve('./src'))
    SvgChainConfig(chainConfig, {
      path: 'src/assets/icons'
    })
  }
}