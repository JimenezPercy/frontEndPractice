//文件系统模块，node内置模块
const fs = require('fs');
const Promise = require('./Promise');

// //异步读取文件，并列时属于并行读取，无先后顺序
// fs.readFile('./a.txt', 'utf-8', function (err,data) {
//     if(err) return;
//     console.log(data);
//
//     fs.readFile('./b.txt', 'utf-8', function (err,data) {
//         if(err) return;
//         console.log(data);
//     });
// });

function readFile(name, encoding) {
    return new Promise(((resolve, reject) => {
        fs.readFile(name, encoding, function (err, data) {
            if (err) return reject(err);
            resolve(data);
        })
    }));
}

// readFile('a.txt', 'utf8').then((data) => {
//     console.log(data);
//     readFile('./b.txt','utf8').then((data)=>{
//         console.log(data);
//     },(reason)=>{});
// }, (r) => {
//     console.log(r);
// });
//一个promise实例可以连续打点调用then，链式调用
//1.上一次then返回值是一个promise实例
// 该实例假如成功状态下一次then会执行成功回调
// 该实例假如失败，下一次then就执行失败回调
//2.上一次then返回值是普通值，则会把普通值传递到下一个then的成功回调
//3.上一次then抛异常，会执行下一次then的失败回调
//4.上一次then执行的回调无返回值,下一次then会报undefined,并不执行下一次then的成功失败回调
let p2 = readFile('a.txt', 'utf8').then((data) => {
    console.log("success-1", data);
    // throw new Error("err")
    // return readFile('./b.txt','utf8');
    return 10;
}, (r) => {
    console.log("fail-1", r);
}).then((data) => {
    console.log("success-2", data);
}, (reason) => {
    console.log("fail-2", reason)
});
