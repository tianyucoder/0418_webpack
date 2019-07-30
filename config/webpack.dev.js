/**
 *  开发环境配置
 */

//引入path模块，用于解决路径问题
const path = require('path');
//引入webpack
const webpack = require('webpack');
//引入公共配置文件
const common = require('./webpack.common.js')
//引入组合配置文件库
const merge = require('webpack-merge')

module.exports = merge(common,{
  //入口（从哪里进入开始解析）
  entry:['./src/js/index.js','./src/index.html'],

  //所有的loader都要在如下的对象中注册
  module: {
    rules: [
      //使用less-loader解析less为css
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // 将css模块加工成一个style节点（样式已经放入该节点）
        }, {
          loader: 'css-loader' // 翻译css为CommonJs的模块
        }, {
          loader: 'less-loader' //编译less为css
        }]
      },
      //使用html-loader(为了自动刷新)
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      }
    ]
  },

  //所有插件在如下数组中声明且实例化
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ],

  //配置devServer
  devServer: {
    hot: true, //热模替换
    open:true,//自动打开浏览器
    port:3001,//dev服务器运行的端口
    compress:true//启用gzip压缩
  }
})


