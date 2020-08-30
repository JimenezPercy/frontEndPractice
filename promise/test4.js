const Promise=require('./Promise');
let p = new Promise((resolve, reject) => {
    resolve();
});

let p2=p.then(354,123).then((d)=>{
    console.log("success2",d)
},(e)=>{
    console.log("fail2",e)
})
