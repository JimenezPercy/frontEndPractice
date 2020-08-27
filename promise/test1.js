//导入
const Promise=require('./Promise');

const p=new Promise((resolve,reject)=>{
    console.log("test");

    // throw new Error('error');
    resolve('123');
    // reject('456');
});

p.then((data)=>{
    console.log('success',data);
},(r)=>{
    console.log('fail',r);
});

// p.then((data)=>{
//     console.log('success',data);
// },()=>{
//     console.log('fail');
// });
