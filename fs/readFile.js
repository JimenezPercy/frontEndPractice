const fs=require('fs');
const path=require('path');

// let buf=Buffer.alloc(3);

// fs.open(path.join(__dirname,'a.txt'),'r',(err,fd)=>{
//     fs.read(fd,buf,0,3,0,(err,byteRead)=>{
//         console.log(byteRead)
//     });
// });

let buf=Buffer.from('测试文本!!!');
fs.open(path.join(__dirname,'a.txt'),'w',(err,fd)=>{
    fs.write(fd,buf,9,3,0,(err,written)=>{
        console.log(written);
    })
});
