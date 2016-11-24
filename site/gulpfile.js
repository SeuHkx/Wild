/**
 * Created by hkx on 2016/11/23.
 */
'use strict';
const gulp = require('gulp');
const gulpTs = require('gulp-typescript');
const gulpWebpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config');

gulp.task('serve:build',()=>{
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
gulp.task('serve',['serve:build']);
gulp.task('client:build',()=>{
    gulp.src('./app/client/src/main.tsx')
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest('./app/client/dist'));
});
gulp.task('client',['client:build']);
gulp.task('build', ['serve', 'client']);
gulp.task('default',['build']);
