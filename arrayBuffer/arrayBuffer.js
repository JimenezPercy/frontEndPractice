function stringToArrayBuffer(str) {
    //一个字符占两个字节
    let buffer = new ArrayBuffer(str.length * 2);
    //创建视图
    let view = new Uint16Array(buffer);
    for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i);
    }
    return buffer;
}

console.log(stringToArrayBuffer('中国'))
