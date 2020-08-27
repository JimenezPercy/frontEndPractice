const Promise=require('./Promise');

const p=new Promise((resolve,reject)=>{
    // resolve('harder');
    reject('fail')
    // setTimeout(()=>{
    //     if(Math.random()>0.5){
    //         resolve('>0/5');
    //     }else {
    //         reject('<=0.5');
    //     }
    // },1000);
});

p.then((data)=>{
    console.log('success1',data);
},(r)=>{
    console.log('fail1',r);
});

p.then((data)=>{
    console.log('success2',data);
},(r)=>{
    console.log('fail2',r);
});
