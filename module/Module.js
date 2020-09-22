const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Module(id) {
    this.id = id;
    this.exports = {};
}

function req(filename) {
    filename = Module._resolveFilename(filename);
    //先查找缓存
    let cacheModule=Module._cache[filename];
    if(cacheModule){
        return cacheModule.exports;
    }
    //创建模块
    let module = new Module(filename);
    //缓存
    Module._cache[filename]=module;
    //尝试加载模块
    module.load();
    return module.exports;
}

/**
 * 缓存
 * @type {{}}
 * @private
 */
Module._cache = {};

/**
 * 模块加载
 */
Module.prototype.load = function () {
    //获取扩展名
    let extName = path.extname(this.id);
    //根据扩展名执行响应操作
    Module._extensions[extName](this);
}

/**
 * 文件扩展名，及对应操作
 * @type {{".js"(*): void, ".json"(*): void}}
 * @private
 */
Module._extensions = {
    '.js'(module) {
        //文件内容
        let content = fs.readFileSync(module.id, 'utf8');
        //包装函数字符串
        content = Module.wrapper[0] + content + Module.wrapper[1];
        //将函数字符串转为真正的函数
        let fn = vm.runInThisContext(content);
        //获取模块导出参数
        let exports = module.exports;
        let dirname = path.dirname(module.id);
        //重改this指向Module.exports
        fn.call(Module.exports, exports, req, module, module.id, dirname);
    },
    '.json'(module) {
        let content = fs.readFileSync(module.id, 'utf8');
        module.exports = JSON.parse(content);
    }
}

/**
 * 函数包装
 * @type {*[]}
 */
Module.wrapper = [
    `(function (exports,require,module,__filename,__dirname) {`,
    `})`
]

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
            let flag = fs.existsSync(newPath);
            if (flag) {
                return newPath;
            }
        }
        throw new Error("module not exists");
    }
}

const r = req('./a')
console.log(r);
