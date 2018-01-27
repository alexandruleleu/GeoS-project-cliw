var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        dashboard: './src/pages/dashboard/dashboard.js',
        login: './src/pages/login/login.js'
    },
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: '[name].bundle.js'
        // publicPath: '/dist'
    },
    module:{
        loaders:[
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel',
                include: path.resolve(__dirname, '/dist')
            },
        ],
        rules:[
            {
                test: /\.css$/,
                use: [
                  { loader: "style-loader" },
                  { loader: "css-loader" }
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: 'file-loader',
                    options:{
                        name: '[name].[ext]',
                        outputPath: 'img/',
                        publicPath: 'img/'
                    }
                }
                
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: 'font-loader',
                    options:{
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: 'fonts/'
                    }
                }
            }
        ]
     },
     
    plugins: [
        new HtmlWebpackPlugin({
            title: 'login',
            filename: 'login.html',
            excludeChunks: ['dashboard'],
            chunks: ['login'],
            template: './src/pages/login/login.html',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: 'dashboard',
            chunks: ['dashboard'],
            excludeChunks: ['login'],
            filename: 'dashboard.html',
            template: './src/pages/dashboard/dashboard.html',
            inject: 'body'
        })
        // new CleanWebpackPlugin(['dist'])
    ]
};

