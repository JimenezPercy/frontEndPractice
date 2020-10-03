const express = require('express');

const app = express();

app.use(express.static(__dirname));

app.get('/get',(req,res)=>{
       res.send('Hello world!')
});

app.get('/resData',(req,res)=>{
    res.send({"name":"lucy"})
});

app.listen(8888)
