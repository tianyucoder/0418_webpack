/**
 * webpack的核心配置文件：执行webpack命令时，会在当前目录查找webpack.config.js文件读取配置
 * 1.通过Commonjs暴露出去一个对象
 * 2.四个关键的概念：
 *    entry：入口文件，将所有打包资源全部引入
 *    output：输出，将资源输出到指定目录下
 *    loader：处理webpack不能够解析的模块
 *    plugins：执行loader做不了的任务
 * 3.如何找到自己想要的loader？
 *   优先去官网找自己想要的loader，没有再去npm官网上找。
 * 4.在终端输入：webpack ./src/js/app.js ./build/js/built.js
 *  问题：这种方式只能够编译打包js、json文件，其他文件处理不了
 * 5.webpack --display-modules可以查看隐藏的任务
 */

//引入path模块，用于解决路径问题
const path = require('path');
//使用extract-text-webpack-plugin提取css为单独文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//引入clean-webpack-plugin，用于清空文件夹
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
//引入公共配置文件
const common = require('./webpack.common.js')
//引入组合配置文件库
const merge = require('webpack-merge')
//引入webpack
const webpack = require('webpack')
//引入less-plugin-clean-css，压缩css
const CleanCSSPlugin = require("less-plugin-clean-css");
//引入html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common,{

    //输出（最终加工完的代码输出到哪里）
    output: {// 输出配置
      path: path.resolve(__dirname, '../dist'),//输出文件路径配置
      filename: './js/[name].[hash:5].js',// 输出文件名
    },

    //所有的loader都要在如下的对象中注册
    module: {
      rules: [
        //提取css为单独文件
        {
          test: /\.less$/, //匹配文件的规则，说明该loader对哪个文件生效
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader","postcss-loader",{
              loader: "less-loader", options: {
              plugins: [
                new CleanCSSPlugin({ advanced: true })
              ]
            }}]
          })
        }
      ]
    },

    //所有插件在如下数组中声明且实例化
    plugins:[
      //提取css为单独文件
      new ExtractTextPlugin("./css/[name].[hash:5].css"),
      //清空输出文件夹
      new CleanWebpackPlugin(),
      //压缩js
      new webpack.optimize.UglifyJsPlugin({sourceMap:true}),
      //压缩+生成html
      new HtmlWebpackPlugin({
        title:"webpack",//生成html文件title标签
        filename:"index.html",//生成html文件的名字
        template:"./src/index.html",//模板的位置
        minify:{ removeComments:true, collapseWhitespace:true}
      }),
    ],
    //生成映射文件
    devtool:'source-map'
  })

