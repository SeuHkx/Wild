/**
 * Created by Hekx on 16/2/2.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass',function(){
    var watcher = gulp.watch('sass/*.scss',function(){
        return gulp.src('sass/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('css/'));
    });
    watcher.on('change',function(event){
        if(event.type === 'changed'){
            console.log("*****编译文件*****");
        }
    })
});

