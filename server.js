var express     = require('express');
var compression = require('compression');
var app         = express();

app.use(compression());

app.use(express.static(__dirname + '/dist', { maxAge: 2592000000 }));
app.listen(3000);
console.log('Listening on port 3000');