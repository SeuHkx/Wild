/**
 * Created by Hekx on 16/4/29.
 */
var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
gulp.task('js', function() {
    return gulp.src('sugarTpl.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});
