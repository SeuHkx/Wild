/**
 * Created by hkx on 2016/11/23.
 */

const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry : {
        main: [
            './app/client/src/main.ts'
        ]
    },
    output: {
        filename : '[name].bundle.js',
        path :path.resolve(__dirname,'./app/client/dist')
    },
    resolve: {
        extensions: ['','.ts', '.tsx', '.js']
    },
    module :{
        loaders: [
            { test: /\.tsx?$/, loader: './../node_modules/ts-loader' }
        ]
    }
};
