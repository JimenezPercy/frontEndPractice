//导入
// const Promise=require('./Promise');

const p=new Promise((resolve,reject)=>{
    console.log("test");

    // throw new Error('error');
    resolve('123');
    // reject('456');
});

p.then((data)=>{
    console.log('success1',data);
    throw 123;
},(r)=>{
    console.log('fail1',r);
}).finally(v=>{
    console.log('finally',v);
}).then((data)=>{
    console.log('success2',data);
},(e)=>{
    console.log('fail2',e);
});
