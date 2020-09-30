const express = require('express');
const app = express();
app.listen(8888);
app.use(express.static(__dirname));
app.get('download', (req, res) => {
    res.download('a.js');
});


