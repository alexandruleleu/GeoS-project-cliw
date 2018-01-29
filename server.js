var path = require('path');
var express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')


var app = express();

const indexPath = path.join(__dirname, './src/login.html')
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', function (_, res) {res.sendFile(indexPath) })
app.set('port', process.env.PORT || 8080);

const compiler = webpack(config)
app.use(webpackHotMiddleware(compiler))
app.use(webpackDevMiddleware(compiler))

var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});

