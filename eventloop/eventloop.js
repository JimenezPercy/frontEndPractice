
// setTimeout(()=>{
//   console.log('timeout1')
// })
//
// setTimeout(()=>{
//   console.log('timeout2')
//   Promise.resolve(1).then(()=>{
//     console.log('then')
//     setTimeout(()=>{
//       console.log('timeout4')
//     })
//   });
// })
// setTimeout(()=>{
//   console.log('timeout3')
// })

setTimeout(()=>{
  console.log('timeout')
},1)

setImmediate(()=>{
  console.log('setImmediate')
})
