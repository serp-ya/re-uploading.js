const path = require('path');

module.exports = {
  entry: ['whatwg-fetch', 'babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.map'
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)|(apiServer)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0',]
          }
        }
      }
    ]
  },
  devServer: {
    inline: true,
    port: 7777
  }
};