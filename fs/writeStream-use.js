const fs = require('fs');
const path = require('path');

// const ws = fs.createWriteStream(path.join(__dirname, 'my.text'), {
//     flags: 'w',
//     encoding: 'utf8',
//     mode: 0o666,
//     autoClose: true,
//     start: 0,
//     highWaterMark: 6//默认16*1024
// });

const WriteStream=require('./WriteStream');
const ws = new WriteStream(path.join(__dirname, 'my.text'), {
    flags: 'w',
    encoding: 'utf8',
    mode: 0o666,
    autoClose: true,
    start: 0,
    highWaterMark: 6//默认16*1024
});

ws.on('open',()=>{
    console.log('文件打开')
})
//按照调用顺序
let flag=ws.write('ccc','utf8',()=>{
    console.log('写入成功1')
})
console.log(flag)
flag=ws.write('ttt','utf8',()=>{
    console.log('写入成功2')
})
console.log(flag)
// ws.end();
ws.on('close',()=>{
    console.log('文件关闭')
})
