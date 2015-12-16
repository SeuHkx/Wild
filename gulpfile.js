'use strict';

var gulp = require('gulp');
var path = require('path');
var packageJson = require('./package');
var config = require('./config');

var opts = {
    pattern: ['gulp-*'],
    config: packageJson,
    scope: ['devDependencies'],
    lazy: true,
    rename: config.name
};
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins(opts);

var file = {
    currentFile : function(event){
        return path.basename(event.path);
    },
    changeFile: function (event) {
        return this.currentFile(event);
    },
    filePath: function (event) {
        return path.dirname(event.path) + '/' + this.changeFile(event);
    },
    fileDist : null
};
gulp.task('clean',function(){
    return gulp.src(config.dir.dist, {read: false})
        .pipe(plugins.clean());
});
gulp.task('compile',function(){
    var watcher = gulp.watch(config.dir.sass,function(event){
            if(event.type === 'changed' || event.type === 'added'){
                file.fileDist = false;
                if(file.changeFile(event).split('.').shift() === packageJson.name)file.fileDist = true;
                var compile = gulp.src(file.filePath(event))
                    .pipe(plugins.sass().on('error', plugins.sass.logError))
                    .pipe(plugins.prefix({
                        browsers: [
                            'last 2 version', 'safari 5', 'ie 8',
                            'ie 9', 'opera 12.1', 'ios 6', 'android 4'
                        ],
                        cascade: true
                    }))
                    .pipe(gulp.dest(file.fileDist ? config.dir.dist :config.dir.widget));

                return compile;
            }
    });
    watcher.on('change',function(event){
        if(event.type === 'changed'){
            console.log("*****编译文件*****:"  + "  " + file.changeFile(event));
        }
    })
});
gulp.task('minify',['clean'],function(){
    return gulp.src('sass/Wild.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.prefix({
            browsers: [
                'last 2 version', 'safari 5', 'ie 8',
                'ie 9', 'opera 12.1', 'ios 6', 'android 4'
            ],
            cascade: true
        }))
        .pipe(gulp.dest(config.dir.dist))
        .pipe(plugins.rename({
            suffix : '.min'
        }))
        .pipe(plugins.mini({compatibility: 'ie7'}))
        .pipe(gulp.dest(config.dir.dist));
});

