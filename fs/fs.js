const fs = require('fs');
const path = require('path')

fs.readFile(path.resolve(__dirname, 'a.txt'), function (err, data) {
    if (err) {
        console.log(err)
    } else {
        console.log(data.toString());
        fs.appendFile(path.resolve(__dirname, 'acopy.txt'),data,{flag:'a'},function (err) {
            console.log('success');
        })
    }
})
