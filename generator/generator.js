let fs = require('fs').promises;
// let co = require('co');


function* read() {
    let fileName = yield fs.readFile('a.txt', 'utf8');
    let bContent = yield fs.readFile(fileName, 'utf8');
    console.log(bContent);
}

function co(it) {
  return new Promise((resolve,reject)=>{
    function next(data) {
      let {value,done}=it.next(data);
      if(done){
        //迭代完成，将状态改为成功态
        resolve(value);
      }else {
        Promise.resolve(value).then(data=>{
          //迭代未完成递归进行
          next(data);
        },err=>{
          //抛错
          it.throw(err);
        });
      }
    }
    //第一次执行，不需要传参
    next();
  });
}

// let it = read();
// let {value, done} = it.next();
// value.then((data) => {
//     let {value, done} = it.next(data);
//     value.then((data1) => {
//         let {value, done} = it.next(data1);
//         console.log(value, done)
//     })
// });

co(read()).then(data=>{
  console.log(data)
});

