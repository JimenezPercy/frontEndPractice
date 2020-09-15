let fs = require('fs').promises;



async function read() {
  let fileName = await fs.readFile('a.txt', 'utf8');
  let bContent = await fs.readFile(fileName, 'utf8');
  return bContent;
}

read().then(data=>{
  console.log(data);
});