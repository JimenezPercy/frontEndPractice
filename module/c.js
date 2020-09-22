const fs = require('fs');
const path = require('path');
const vm = require('vm');

//判断文件是否存在
const flag = fs.existsSync('./Module.js');
//同步读取文件
if (flag) {
    const context = fs.readFileSync('./Module.js');
}
//拼接并解析路径
const resolvePath = path.resolve(__dirname, '../Module.js');
// console.log(__filename);
console.log(resolvePath)

console.log(path.basename('/asd/Module.js', '.js'));

let str = 'console.log(123)';

const fn = vm.runInThisContext(str);
