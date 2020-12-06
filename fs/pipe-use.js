const ReadStream = require('./ReadStream');
const WriteStream = require('./WriteStream');
const path = require('path');

let r = new ReadStream(path.join(__dirname, './copya.txt'), {
    highWaterMark: 3
});

let w = new WriteStream(path.join(__dirname, './my.txt'), {
    highWaterMark: 1
})

r.pipe(w);
