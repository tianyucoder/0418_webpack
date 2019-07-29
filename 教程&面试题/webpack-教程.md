###1.了解Webpack相关
	* 什么是webpack
	    * Webpack是一个模块打包器(bundler)。
	    * 在Webpack看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理
	    * 它将根据模块的依赖关系进行静态分析，生成对应的静态资源
    * 四个核心概念
        * Entry：入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。
        * Output：output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。
        * Loader：loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只能解析： JavaScript、json）。
        * Plugins：插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。
	* 理解Loader
    	* Webpack 本身只能加载JS/JSON模块，如果要加载其他类型的文件(模块)，就需要使用对应的loader 进行转换/加载
	    * Loader 本身也是运行在 node.js 环境中的 JavaScript 模块
	    * 它本身是一个函数，接受源文件作为参数，返回转换的结果
	    * loader 一般以 xxx-loader 的方式命名，xxx 代表了这个 loader 要做的转换功能，比如 json-loader。
	* 理解Plugins
		* 插件件可以完成一些loader不能完成的功能。
		* 插件的使用一般是在 webpack 的配置信息 plugins 选项中指定。
		* CleanWebpackPlugin: 自动清除指定文件夹资源
		* HtmlWebpackPlugin: 自动生成HTML文件并
		* UglifyJSPlugin: 压缩js文件
	* 配置文件(默认)
    	* webpack.config.js : 是一个node模块，返回一个 json 格式的配置信息对象
	
### 2.学习文档 : 
  * webpack官网: http://webpack.github.io/
  * webpack3文档(英文): https://webpack.js.org/
  * webpack3文档(中文): https://doc.webpack-china.org/

###3.webpack的基本使用

	1. 生成package.json文件
	2. 安装webpack（都要安装）：
		- npm install webpack@3 -g  //全局安装
    	- npm install webpack@3 --save-dev  //局部安装
    3. 小试牛刀处理一个js
    	执行命令：webpack src/js/index.js build/index.js
    观察发现webpack会把es6的模块化语法，直接编译为浏览器识别的模块化语法，不过类似于箭头函数等依然存在
       
###4.使用webpack配置文件

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
    const path = require('path'); //path内置的模块，用来设置路径。
    
    module.exports = {
      //入口（从哪里进入开始解析）
      entry:'./src/js/index.js',
    
      //出口（最终加工完的代码输出到哪里）
      output: {// 输出配置
        path: path.resolve(__dirname, 'build'),//输出文件路径配置
        filename: 'index.js',// 输出文件名
      }
    };
    
###5.在package.json中配置npm命令 
       
       "scripts": {
              "build": "webpack"
        },
       //打包应用运行:npm run build

           
###6.使用loader解析less文件（使用less-loader）
	
	1. 安装：npm install less-loader less  --save-D
	2. 安装：npm install css-loader style-loader --save-D
	3. 向rules中写入配置：
		{
            test: /\.less$/,
            use: [{
                loader: "style-loader" // 创建一个style标签，将js中的css放入其中
            }, {
                loader: "css-loader" // 将css以CommonJs语法打包到js中
            }, {
                loader: "less-loader" // 将less转换成css
            }]
        }
	4. 在入口js中引入less文件：import '../less/demo.less';

###7.file-loader处理图片资源

	1. 安装：npm install --save-dev file-loader
	2. 新增loader：
		{
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader', //如果不做图片转base64，可以用file-loader
            options: {
              outputPath:'img', //图片最终输出的位置
              publicPath:'../build/img',//css资源图片路径
      		  name:'[hash:5].[ext]'//修改图片名称
            }
          }
        ]
      }	

###8.url-loader处理图片资源&base64

	1. 安装：npm install url-loader --save-D
	2. 修改loader为：
		 {
	        test: /\.(png|jpg|gif)$/,
	        use: [
	          {
	            loader: 'url-loader',       //如果不做图片转base64，可以用file-loader
	            options: {
	              limit: 8192,          
	              outputPath:'img',         //图片最终输出的位置
	              publicPath:'../build/img',//css资源图片路径
                  name:'[hash:5].[ext]'     //修改图片名称
	            }
	          }
	        ]
	      }
	3. 备注：一定要注意路径的问题
	
###9.使用插件提取css,合并为单独的文件

	1. 安装ExtractTextWebpackPlugin插件：npm install extract-text-webpack-plugin --save-D
	2. 引入插件：const ExtractTextPlugin = require("extract-text-webpack-plugin");
	3. 新增plugins插件配置项，并实例化ExtractTextPlugin插件：
		plugins: [
    		//提取css为单独文件
    		new ExtractTextPlugin("./css/index.css"),
		]
	4. 修改原less-loader的配置如下：
		{
        test: /\.less$/, //匹配文件的规则，说明该loader对哪个文件生效
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader","less-loader"]
        })
       }
	5.备注：因为css提取成单独文件，不再包含在js中了，所以要修改url-loader配置publicPath为:'../img'
###10.js语法检查

	1. 安装jshint-loader：npm i jshint-loader --save -D
	2. 新增loader：
		{
        test: /\.js$/, // 涵盖 .js 文件
        enforce: "pre", // 预先加载好 jshint loader
        exclude: /node_modules/, // 排除掉 node_modules 文件夹下的所有文件
        use: [
          {
            loader: "jshint-loader",
            options: {
              //jslint 的错误信息在默认情况下会显示为 warning（警告）类信息
              //将 emitErrors 参数设置为 true 可使错误显示为 error（错误）类信息
              emitErrors: false,

              //jshint 默认情况下不会打断webpack编译
              //如果你想在 jshint 出现错误时，立刻停止编译
              //请设置 failOnHint 参数为true
              failOnHint: false
            }
          }
        ]
      }
	3. 备注：有一个小坑，就是仅仅安装jshint-loader还不够，还要安装js-hint,命令：npm i jshint --save -D
	
###11.es6转es5

    1. 安装babel-loader，命令：npm install babel-loader babel-core babel-preset-es2015 --save -D
    2. 配置新的loader：
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['es2015']
              }
            }
       }
    3. 坑！提示找不到"@babel/core"，根据提示执行：npm i babel-loader@7 --save -D
   

###12.html文件的处理和清除文件夹

	1. 对于html的操作，虽然有了html-loader这个loader，不过功能有限，我们的需求是：
	   想让webpack自动的帮我们创建一个html，然后把我们想要引入的东西引入进来，所以要借助插件。
	2. 使用插件HtmlWebpackPlugin，安装：npm install --save-dev html-webpack-plugin
	3. 引入插件：var HtmlWebpackPlugin = require('html-webpack-plugin');
	4. 新增一个插件配置项：
		new HtmlWebpackPlugin({
        title:"webpack",
        filename:"index.html",
        template:"./src/index.html"
       }),
       备注：要在html模板中写入<title><%= htmlWebpackPlugin.options.title %></title>，title配置才生效
	5. 删除掉模板html中的所有引入
	6. 为了清空工作目录，安装插件：clean-webpack-plugin，命令：npm i clean-webpack-plugin -D
	7. 引入插件： const CleanWebpackPlugin = require('clean-webpack-plugin')
	8. 实例一个插件：
		new CleanWebpackPlugin('./build')
	备注：最新版的CleanWebpackPlugin不传任何参数
	

###13.提取build环境配置文件
	
	1. 新建文件目录：config
	2. 移动webpack.config.js文件到config中，改名为：webpack.build.js
	3. 通过执行：webpack --display-modules --config ./config/webpack.build.js 指定配置文件运行
	4. 完善一下：在package.json中自定义命令："build": "webpack --display-modules --config ./config/webpack.build.js"
	5. 以后可以通过：npm run build 代替完整命令
	6. 【问题】：发现build文件夹出现在了config中，解决办法如下：
		修改出口output中的path为：resolve(__dirname, '../build')
	7. 【问题】：上一步的清空位置发生了改变，解决办法如下：
		修改CleanWebpackPlugin插件的配置如下：
			new CleanWebpackPlugin('./build',{
      			root:resolve(__dirname,'../')
    		})
	备注：如果使用的clean-webpack-plugin插件是2.0以上的，则不会出现问题7


###14.提取dev环境配置文件(dev环境搭建)

	1. 复制一份webpack.build.js，改名为：webpack.dev.js
	2. 安装dev-server：npm i webpack-dev-server@2 -D（下载第2个版本，3版本有兼容性问题）
	3. 修改package.json的配置："dev": "webpack-dev-server --config ./config/webpack.dev.js"
	4. 在webpack.dev.js中配置dev服务器编：
	    //配置开发服务器
          devServer: {
            hot: true,
            open:true,
            port:3001,
            compress:true
          }
		备注：官网-->配置-->开发中server(devserver)可见详细配置
    5. 启用HMR（热模替换）
        引入webppack：const webpack = require('webpack');
        追加一个插件：new webpack.HotModuleReplacementPlugin()
	6. 存在的问题：改了css、html还得手动刷新才可以，解决如下：
	7. 【 解决css无法模块热更新的问题】因为css用的是插件，不是loader，所以不行，解决办法：重新使用loader的方式。
	8. 【 解决html无法自动刷新的问题】因为html也是插件，办法：html依然用插件，追加使用loader，安装：npm i html-loader -D，新增html-loader配置项如下：
	 {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      }
	  同时entry重写为:['./src/js/index.js','./src/index.html']
	  备注：需要注意的是：dev方式的运行是加载在内存中的，没有任何输出


###15.提取公共代码实现复用

	1. 参考webpack.build.js，新增：webpack.common.js
	2. webpack.common.js中删除所有css的loader，删除CleanWebpackPlugin，删除ExtractTextPlugin插件，删除最上方二者的引用
	3. 在webpack.build.js上方引入：const common = require('./webpack.common')
	4. 安装合并库：npm i webpack-merge -D，引入merge库：const merge = require('webpack-merge')
	5. module.exports = merge(common,{当前文件所有配置})
	6. 剔除webpack.build.js中：入口，出口，图片处理，js语法检查，es6转换，HtmlWebpackPlugin
	7. 剔除webpack.dev.js中：出口，图片处理，js语法检查，es6转换，插件只保留：HotModuleReplacementPlugin


###16.prod环境配置

	* 复制webpack.build.js，改名：webpack.prod.js
	* package.json中追加："prod": "webpack --display-modules --config ./config/webpack.prod.js",
	* pro模式输出的文件在dist文件夹中，修改出口配置：path: resolve(__dirname, '../dist'),filename: './js/[name].[hash:10].js'
	* 修改css插件配置：new ExtractTextPlugin("./css/[name].[hash:10].css"),	

	【压缩js】
	* 使用插件（用于压缩js文件）：UglifyjsWebpackPlugin
	* 引入webpack：const webpack = require('webpack')
	* 插件中新增配置：new webpack.optimize.UglifyJsPlugin({sourceMap:true})
	* 追加一个配置（与插件同级）：devtool:'source-map'

	【css扩展前缀】
	* 使用loader：postcss-loader，执行安装：npm i -D postcss-loader
	* 在css的loader配置中加入postcss-loader：use: ["css-loader","postcss-loader","less-loader"]
	* 在根目录新建postcss.config.js文件，配置如下内容：
		module.exports = {
		  "plugins": {
		    "autoprefixer": {
		      "browsers": [
		        "ie >= 8",
		        "ff >= 30",
		        "chrome >= 34",
		        "safari >= 7",
		        "opera >= 23"
		      ]
		    }
		  }
		}
	* 安装所需的autoprefixer，命令：npm i autoprefixer -D

	【压缩css】
	* 使用less-plugin-clean-css插件，命令：npm i less-plugin-clean-css -D
	* 引入插件：const CleanCSSPlugin = require("less-plugin-clean-css");
	* 替换use中的less-loader为对象,如下：
		loader: "less-loader", options: {
	                plugins: [
	                    new CleanCSSPlugin({ advanced: true })
	                ]
	            }
		
	【压缩html】
	* 将webpack.common.js中的HtmlWebpackPlugin插件复制过来
	* 追加一个配置项：minify:{ removeComments:true, collapseWhitespace:true}

	


