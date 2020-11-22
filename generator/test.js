function* read() {
    yield 'node'
    console.log(2123123)
    yield 'vue'
}

let it=read();


console.dir(it.next())
console.dir(it.next())
console.dir(it.next())

