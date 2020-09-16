
process.nextTick(()=>{
  console.log('nextTick')
});
console.log(1)

Promise.resolve().then(()=>{
  console.log('promise');
});

process.nextTick(()=>{
  console.log('nextTick1')
})
