const { name } = require('./package.json');
const path = require('path');
const fs = require('fs');


const MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    cssPlugin = new MiniCssExtractPlugin({ filename: "[name].css" });

const HtmlWebpackPlugin = require('html-webpack-plugin'),
    htmlPlugin = new HtmlWebpackPlugin({
        title: name,
        inject: 'head',
        template: path.resolve(__dirname, './sandbox/index.html')
    });

module.exports = {
    mode: 'development',
    entry: {
        'bundle': getIndexJS('./src/'),
        'sandbox': getIndexJS('./sandbox/')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.yaml$/,
                exclude: /(node_modules)/,
                loader: ['json-loader', 'yaml-loader'],
            },
            {
                test: /.flave$/,
                exclude: /(node_modules)/,
                use: ['babel-loader', 'flave-loader']
            },
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: { name: '[name].[ext]' }
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    },
    plugins: [cssPlugin, htmlPlugin],
}

function getIndexJS(basepath) {
    const files = ['index.ts', 'index.js', 'script.ts', 'script.js'];
    for (let index = 0; index < files.length; index++) {
        const file = path.resolve(basepath, files[index]);
        if (fs.existsSync(file))
            return file;
    }
}