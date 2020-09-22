const fs = require('fs');
const path = require('path');
const vm = require('vm');

// const a = require('./a');
req('./a.js')

function Module(id) {
    this.id = id;
    this.exports = {};
}

Module._extensions = {
    '.js'() {

    },
    '.json'() {

    }
}

/**
 * 将文件路径解析为绝对路径
 * @param filename
 * @private
 */
Module._resolveFilename = function (filename) {
    const absPath = path.resolve(__dirname, filename);
    //判断文件是否存在
    const isExists = fs.existsSync(absPath);

    if (isExists) {
        return absPath;
    } else {
        //若是不存在，尝试加后缀
        let exts = Object.keys(Module._extensions);
        for (let i = 0; i < exts.length; i++) {
            //拼接扩展名
            let newPath = absPath + exts[i];
            //判断文件是否存在
            let flag=fs.existsSync(newPath);
            if(flag){
                return newPath;
            }
        }
        throw new Error("module not exists");
    }
}

function req(filename) {
    filename = Module._resolveFilename(filename);
    console.log(filename);
}
