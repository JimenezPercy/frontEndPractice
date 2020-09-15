const Promise=require('./Promise');
let p = new Promise((resolve, reject) => {
    reject();
}).then(()=>{
  // return new Promise((resolve,reject)=>{
  //   reject(123);
  // })
},()=>{
    return new Promise((resolve,reject)=>{
        resolve(new Promise((resolve,reject)=>{
          resolve("sadasds")
        }));
    })
}).finally((d)=>{
  console.log('finally',d);
}).then((d)=>{
    console.log("success2",d)
},(e)=>{
    console.log("fail2",e)
});
