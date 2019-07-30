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
//使用html-webpack-plugin生成html
const HtmlWebpackPlugin = require('html-webpack-plugin');
//引入clean-webpack-plugin，用于清空文件夹
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
//引入公共配置文件
const common = require('./webpack.common.js')
//引入组合配置文件库
const merge = require('webpack-merge')

module.exports = merge(common,{

    //所有的loader都要在如下的对象中注册
    module: {
      rules: [
        //提取css为单独文件
        {
          test: /\.less$/, //匹配文件的规则，说明该loader对哪个文件生效
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader","less-loader"]
          })
        },
      ]
    },

    //所有插件在如下数组中声明且实例化
    plugins:[
      //提取css为单独文件
      new ExtractTextPlugin("./css/index.css"),
      //清空输出文件夹
      new CleanWebpackPlugin()
    ]
  })

