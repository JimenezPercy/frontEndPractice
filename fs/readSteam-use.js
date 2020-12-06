//可读流 基于发布订阅
const fs = require('fs');
const path = require('path');
// let rs = fs.createReadStream(path.join(__dirname, 'copya.txt'), {
//     flags: 'r',
//     encoding: null,
//     mode: 0x666,
//     autoClose: true,
//     emitClose: true,
//     // start: 0,
//     // end: 10,
//     highWaterMark: 3
// });

const ReadStream=require('./ReadStream');
let rs=new ReadStream(path.join(__dirname, 'copya.txt'), {
    flags: 'r',
    encoding: null,
    mode: 0x666,
    autoClose: true,
    emitClose: true,
    start: 3,
    end: 10,
    highWaterMark: 3
});

//流基于事件，内部采用events模块
//打开文件后自动触发
rs.on('open', (fd) => {
    console.log('open', fd);
})

let arr = [];

//默认情况下是暂停模式，监听data事件后，变为流动模式
rs.on('data', (buf) => {
    arr.push(buf);
    console.log(buf)
    // console.log(buf.toString())
    rs.pause();
});


setInterval(()=>{
    rs.resume();
},1000)

//文件读取结束触发
rs.on('end',()=>{
    console.log(Buffer.concat(arr).toString());
});

//文件读取完毕后，触发close事件
rs.on('close', () => {
    console.log('close')
})

//发生错误
rs.on('error',(err)=>{
    console.log(err);
})
