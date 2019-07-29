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
const path = require('path'); //path内置的模块，用来设置路径。
//使用extract-text-webpack-plugin提取css为单独文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//使用html-webpack-plugin生成html
const HtmlWebpackPlugin = require('html-webpack-plugin');
//引入clean-webpack-plugin，用于清空文件夹
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  //入口（从哪里进入开始解析）
  entry:'./src/js/index.js',

  //输出（最终加工完的代码输出到哪里）
  output: {// 输出配置
    path: path.resolve(__dirname, 'build'),//输出文件路径配置
    filename: './js/index.js',// 输出文件名
  },

  //所有的loader都要在如下的对象中注册
  module: {
    rules: [
      //使用less-loader解析less为css
      /*{
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // 将css模块加工成一个style节点（样式已经放入该节点）
        }, {
          loader: 'css-loader' // 翻译css为CommonJs的模块
        }, {
          loader: 'less-loader' //编译less为css
        }]
      },*/
      //提取css为单独文件
      {
        test: /\.less$/, //匹配文件的规则，说明该loader对哪个文件生效
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader","less-loader"]
        })
      },
      //使用file-loader处理图片(不优秀)
      /*{
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',//如果不做图片转base64，可以用file-loader
            options: {
              outputPath:'img', //图片最终输出的位置
              publicPath:'../build/img',//css资源图片路径
              name:'[hash:5].[ext]'//修改图片名称
            },
          },
        ],
      },*/
      //使用url-loader处理图片(可以转base64)
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',//如果不做图片转base64，可以用file-loader
            options: {
              limit: 8192,//当图片小于8KB的时候，转base64
              outputPath:'img', //图片最终输出的位置
              publicPath:'../img',//css资源图片路径
              name:'[hash:5].[ext]' //修改图片名称
            }
          }
        ]
      },
      //使用jshint-loader进行语法检查
      {
        test: /.js/,
        enforce: 'pre',//预先加载好jshint-loader
        exclude: /node_modules/,//排除node_modules下的所有js文件
        use: [
          {
            loader: `jshint-loader`,
            options: {
              //jshint 的错误信息在默认情况下会显示为 warning（警告）类信息
              //将 emitErrors 参数设置为 true 可使错误显示为 error（错误）类信息
              emitErrors: true,

              //jshint 默认情况下不会打断webpack编译
              //如果你想在 jshint 出现错误时，立刻停止编译
              //请设置 failOnHint 参数为true
              failOnHint: false,
              esversion: 6
            }
          }
        ]
      },
      //使用json-loader解析json(为了不让语法检查报错)
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      //使用babel-loader转换语法
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  },

  //所有插件在如下数组中声明且实例化
  plugins:[
    new ExtractTextPlugin("./css/index.css"),
    new HtmlWebpackPlugin(
      {
        title:"webpack",//生成html文件title标签
        filename:"index.html",//生成html文件的名字
        template:"./src/index.html"//模板的位置
      }
    ),
    new CleanWebpackPlugin()
  ]
}

