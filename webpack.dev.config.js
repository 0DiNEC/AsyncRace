const path = require('path')

module.exports = {
  devtool: 'eval-source-map',
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    port: 8080
  }
}
