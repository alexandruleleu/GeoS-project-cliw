var path = require('path');
var express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const fonts = require('express-fonts');
const font_middleware = require("connect-fonts");


var app = express();

const indexPath = path.join(__dirname, './src/index.html')
app.use(express.static(path.join(__dirname, 'dist')));
app.use(font_middleware.setup);
app.get('/', function (_, res) {res.sendFile(indexPath) })
app.set('port', process.env.PORT || 8080);

const compiler = webpack(config)
app.use(webpackHotMiddleware(compiler))
app.use(webpackDevMiddleware(compiler))

var server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});

