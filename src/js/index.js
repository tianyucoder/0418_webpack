/*
* 该文件是【webpack的入口文件】，值得注意的是:这个入口文件【不同于模块化中的入口文件】。
* 该入口文件可以引入：js  css less 图片 ..........
* */

import {add,sub} from './module1';
import {mul} from './module2'
import module3 from './module3';
import data  from '../json/data.json'
import '../less/demo.less'


console.log(add(9,2));
console.log(sub(1,2));
console.log(mul(1,2));
console.log(module3.name,module3.age);
module3.setName('wade');
console.log(module3.name,module3.age);
console.log(data,typeof data)

setTimeout(() =>{
  console.log(1)
},1000)




