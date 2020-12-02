//可读流 基于发布订阅
const fs = require('fs');
const path = require('path');
let rs = fs.createReadStream(path.join(__dirname, 'copya.txt'), {
    flags: 'r',
    encoding: null,
    mode: 0x666,
    autoClose: true,
    emitClose: false,
    start: 0,
    end: 10,
    highWaterMark: 3
});

//流基于事件，内部采用events模块
//打开文件后自动触发
rs.on('open', (fd) => {
    console.log('open', fd);
})
