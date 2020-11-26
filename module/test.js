const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Module(id) {
    this.id = id;
    this.exports = {};
}

function reqTest(fileName) {
    fileName = Module._resolveFilename(fileName);
    if (Module._cache[fileName]) {
        return Module._cache[fileName].exports;
    }
    let module = new Module(fileName);
    Module._cache[fileName] = module;
    module.load()
    return module.exports;
}

Module._cache = {};

Module._extensions = {
    '.js'(module) {
        const content = Module.wrapper[0] + fs.readFileSync(module.id) + Module.wrapper[1];
        const fn = vm.runInThisContext(content);
        fn.call(module.exports, module.exports, reqTest, module, module.id, path.dirname(module.id));
    },
    '.json'(module) {
        const content = fs.readFileSync(module.id);
        module.exports = JSON.parse(content);
    }
}

Module.wrapper = [
    `(function (exports,require,module,__filename,__dirname) {`,
    `})`
]

Module.prototype.load = function () {
    const exts = path.extname(this.id)
    Module._extensions[exts](this);
}

Module._resolveFilename = function (fileName) {
    let paths = path.resolve(__dirname, fileName);
    let exist = fs.existsSync(paths);
    if (exist) {
        return paths;
    } else {
        let newPath;
        for (let ext in Module._extensions) {
            newPath = paths + ext;
            if (fs.existsSync(newPath)) {
                return newPath;
            }
        }
        throw new Error('module not exists');
    }
}

const r = reqTest('./a')
console.log(r);
