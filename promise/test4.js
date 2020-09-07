const Promise=require('./Promise');
let p = new Promise((resolve, reject) => {
    reject();
}).then(()=>{
  // return new Promise((resolve,reject)=>{
  //   reject(123);
  // })
},()=>{
    return new Promise((resolve,reject)=>{
        reject(123);
    })
}).finally((d)=>{
  console.log('catch',d);
}).then((d)=>{
    console.log("success2",d)
},(e)=>{
    console.log("fail2",e)
});
