/**
 * Created by hkx on 2016/11/15.
 */
'use strict';
import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
import * as config from './config';
import * as packageJson from './package';

const opts = {
    pattern:['gulp-*'],
    config:packageJson,
    scope:['devDependencies'],
    lazy:true,
    rename:config.name
};
const plugins = gulpPlugins(opts);

gulp.task('sass',()=>{});




















