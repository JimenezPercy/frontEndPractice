// console.log(global.process)
// console.log(global.process.argv)
const {program}=require('commander');

// program.name('node');
// program.usage('1212321global.js');
// program.option('-p,--port <V>','set port');
// program.option('-h,--host <V>','set host');
// program.command('create').action(()=>{
//   console.log('正在创建项目');
// });
// program.on('--help',()=>{
//   console.log('\r\n Run Command');
//   console.log('\r\n node node/global.js');
// });
// let r=program.parse(process.argv);
// console.log("============")
// console.log(r)

console.log(process.env);