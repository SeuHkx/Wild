/**
 * Created by hkx on 2016/11/23.
 */
'use strict';
const path = require('path');
const gulp = require('gulp');
const gulpTs = require('gulp-typescript');
const gulpWebpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config');
const browserSync = require('browser-sync').create();

gulp.task('g-serve',()=>{
   return gulp.src('./app/**/*.ts')
       .pipe(gulpTs({
           target: 'ES6',
           module: 'commonjs',
           moduleResolution: 'node',
           sourceMap: true,
           noImplicitAny: true
       }))
       .pipe(gulp.dest('./app/build/'))
});
gulp.task('g-client',()=>{
    return gulp.src('./app/client/**/*.tsx')
        .pipe(gulpTs({
            target: 'ES5',
            module: 'commonjs',
            moduleResolution: 'node',
            sourceMap: true,
            noImplicitAny: true,
            jsx : 'react'
        }))
        .pipe(gulp.dest('./app/client/build/'))
});
gulp.task('w-client',['g-client'],()=>{
    return gulp.src('./app/client/build/main.js')
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest('./app/client/dist'));
});
gulp.task('server',()=>{
    browserSync.init({
        proxy:'localhost:3333',
        port : '3334'
    });
    gulp.watch('./app/client/src/**/*.tsx',['w-client']);
    gulp.watch('./app/client/dist/**/*.js').on('change',browserSync.reload);
    gulp.watch('./app/views/**/*.pug').on('change',browserSync.reload);
});
gulp.task('client',['g-client']);
gulp.task('build', ['g-serve','w-client']);
gulp.task('default',['build']);
