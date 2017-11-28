var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.js',
        dashboard: './src/dashboard.js'
    },
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: '[name].bundle.js'
        // publicPath: '/dist'
    },
    module:{
        loaders:[
            {
                test: [/\.js$/],
                loader: 'babel-loader',
                exclude: /node_modules/,
                query:{
                    presets: ['es2015']
                }
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
            title: 'index',
            hash: true,
            excludeChunks: ['dashboard'], 
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'dashboard',
            hash: true,
            chunks: ['dashboard'],
            filename: 'dashboard.html',
            template: './src/dashboard.html'
        })
        // new CleanWebpackPlugin(['dist'])
    ]
};

