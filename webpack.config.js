/**
 * Created by hkx on 2016/11/16.
 */
module.exports = {
  entry : './components/index.tsx',
  output: {
    filename : 'wild.js',
    path :__dirname + '/dist'
  },
  devtool : 'source-map',
  resolve: {
    extensions: ['','.ts', '.tsx', '.js']
  },
  module :{
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ],
    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  }
};
