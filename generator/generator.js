let fs = require('fs').promises;

function* read() {
    let fileName = yield fs.readFile('a.txt', 'utf8');
    let bContent = yield fs.readFile(fileName, 'utf8');
    console.log(bContent);
}

let it = read();
let {value, done} = it.next();
value.then((data) => {
    let {value, done} = it.next(data);
    value.then((data1) => {
        let {value, done} = it.next(data1);
        console.log(value, done)
    })
});
