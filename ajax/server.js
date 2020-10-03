const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname));

app.get('/get', (req, res) => {
    // res.send('Hello world!');
    // console.log(req.query);
    res.send(req.query)
});

app.post('/post', (req, res) => {
    res.send(req.body);
    console.log(req);
});

app.get('/resData', (req, res) => {
    res.send({"name": "lucy"});
});

app.listen(8888)
