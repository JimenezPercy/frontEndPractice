const fs = require('fs');
const path = require('path');

// let buf=Buffer.alloc(3);

// fs.open(path.join(__dirname,'a.txt'),'r',(err,fd)=>{
//     fs.read(fd,buf,0,3,0,(err,byteRead)=>{
//         console.log(byteRead)
//     });
// });

// let buf = Buffer.from('测试文本!!!');
// fs.open(path.join(__dirname, 'a.txt'), 'w', (err, fd) => {
//     fs.write(fd, buf, 9, 3, 0, (err, written) => {
//         console.log(written);
//     })
// });

//文件复制
const BUFFER_SIZE = 3;
const buffer = Buffer.alloc(BUFFER_SIZE);
let readOffset = 0;
fs.open(path.join(__dirname, 'copya.txt'), 'r', (err, rfd) => {
    fs.open(path.join(__dirname, 'temp.txt'), 'a', (err, wfd) => {
        function next() {
            fs.read(rfd, buffer, 0, BUFFER_SIZE, readOffset, (err, byteRead) => {
                if (!byteRead) {
                    fs.close(rfd, () => {
                    })
                    fs.close(wfd, () => {
                    })
                    return
                }
                readOffset += byteRead;
                fs.write(wfd, buffer, 0, byteRead, (err, written) => {
                    next();
                });
            })
        }

        next();
    });
});
