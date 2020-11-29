//创建目录
const fs = require('fs');
const fss = require('fs').promises;
const path = require('path')

//同步创建目录
function mkdirSync(path) {
    const arr = path.split('/');
    for (let i = 0; i < arr.length; i++) {
        let p = arr.slice(0, i + 1).join('/');
        try {
            //判断路径是否存在
            fs.accessSync(p);
        } catch (e) {
            //目录不存在会捕获，并创建
            fs.mkdirSync(p);
        }
    }
}

//异步创建目录
function mkdir(path, callback) {
    let arr = path.split('/');
    let index = -1;

    function next() {
        index++;
        //递归结束，调用回调
        if (index === arr.length) return callback();
        let p = arr.slice(0, index + 1).join('/');
        fs.access(p, (err) => {
            if (err) {
                //没有目录会报错，此时创建目录
                fs.mkdir(p, next);
            } else {
                next();
            }
        })
    }

    next();
}

//同步深度递归删除
function rmdirDeepSync(p) {
    //获取文件或目录状态
    let statObj = fs.statSync(p);
    //判断是否是目录
    if (statObj.isDirectory()) {
        //获取目录下的文件或目录
        let dirs = fs.readdirSync(p);
        //获取文件名目录名数组对应的路径数组
        dirs = dirs.map(dir => path.join(p, dir));
        //遍历路径数组
        dirs.forEach(dir => {
            //递归删除目录
            rmdirDeepSync(dir);
        });
        fs.rmdirSync(p);
    } else {
        //删除文件
        fs.unlinkSync(p);
    }
}

//异步深度串行删除
function rmdirDeep(p, callback) {
    fs.stat(p, function (err, statObj) {
        if (statObj.isDirectory()) {
            fs.readdir(p, function (err, dirs) {
                dirs = dirs.map(dir => path.join(p, dir));
                let index = 0;

                function next() {
                    //所有儿子删除完毕后，删除当前目录
                    if (index === dirs.length) return fs.rmdir(p, callback);
                    let current = dirs[index++];
                    //一个目录删除完毕后再删除下一个目录
                    rmdirDeep(current, next);
                }

                next();
            });
        } else {
            fs.unlink(p, callback);
        }
    })
}

//异步深度并行删除
function rmdirDeepParallel(p, callback) {
    fs.stat(p, function (err, statObj) {
        if (statObj.isDirectory()) {
            fs.readdir(p, function (err, dirs) {
                dirs = dirs.map(dir => path.join(p, dir));
                let index = 0;

                //删除空目录
                if (dirs.length === 0) {
                    return fs.rmdir(p, callback);
                }

                //计数，删除所有儿子之后，删除自己
                function done() {
                    index++;
                    if (index === dirs.length) {
                        fs.rmdir(p, callback);
                    }
                }

                //并行删除
                for (let i = 0; i < dirs.length; i++) {
                    let dir = dirs[i];
                    rmdirDeepParallel(dir, done);
                }
            });
        } else {
            fs.unlink(p, callback);
        }
    })
}

//async+await 异步深度删除
async function rmdirAsync(p) {
    let statObj = await fss.stat(p);
    if (statObj.isDirectory()) {
        let dirs = await fss.readdir(p);

        dirs = dirs.map(dir => rmdirAsync(path.join(p, dir)));
        await Promise.all(dirs);
        await fss.rmdir(p);
    } else {
        await fss.unlink(p);
    }
}

//同步广度遍历删除
//逐层遍历，逆序删除
function rmdirWideSync(p) {
    //存储路径
    let arr = [p];
    let index = 0;
    //当前指向
    let current;
    while (current = arr[index++]) {
        //获取状态
        let statObj = fs.statSync(current);
        //判断是否文件夹
        if (statObj.isDirectory()) {
            //获取目录下的内容
            let dirs = fs.readdirSync(current);
            dirs = dirs.map(dir => path.join(current, dir));
            arr = [...arr, ...dirs];
        }
    }
    //逆序删除
    for (let i = arr.length - 1; i >= 0; i--) {
        let cur = arr[i];
        let statObj = fs.statSync(cur);
        if (statObj.isDirectory()) {
            fs.rmdirSync(cur);
        } else {
            fs.unlinkSync(cur);
        }
    }
}

// mkdirSync('a/b/c')
// rmdirDeepSync('acopy.txt')
// rmdirDeepSync('a')
// rmdirWideSync('a');
// rmdirDeepParallel('a', () => {
//     console.log('success')
// })
rmdirAsync('a').then(()=>{
    console.log('success')
})
