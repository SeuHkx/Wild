/**
 * Created by hkx on 2016/11/15.
 */
'use strict';
import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
import path from 'path';
import * as config from './config';
import * as packageJson from './package';

const opts = {
  pattern: ['gulp-*'],
  config: packageJson,
  scope: ['devDependencies'],
  lazy: true,
  rename: config.name
};
const sassLintConfig = {
  configFile: '/.sass-lint.yml'
};
const file = {
  changeFile(event){
    return path.dirname(event.path) + '/' + path.basename(event.path);
  },
  compilePrivateFile(event){
    let changeFile;
    let arrPath = path.dirname(event.path).split('/');
    let lastPath = arrPath.pop();
    let reflectionFile = 'wd.' + path.basename(event.path).replace(/_\w+\./ig, '');
    if (lastPath === 'variables') {
      changeFile = arrPath.join('/')+'/modules/'+reflectionFile;
      return changeFile;
    }
    return false;
  }
};
const plugins = gulpPlugins(opts);

gulp.task('sass', () => {
  const watcher = gulp.watch('sass/**/*.scss', event => {
    let compile;
    if (event.type === 'changed' || event.type === 'added') {
      let [changeFile,compilePrivateFile] = [file.changeFile(event),file.compilePrivateFile(event)];
      compile = gulp.src(compilePrivateFile?compilePrivateFile:changeFile)
        .pipe(plugins.sassLint(sassLintConfig))
        .pipe(plugins.sassLint.format())
        .pipe(plugins.sassLint.failOnError())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.prefix({
          browsers: [
            'last 2 version', 'safari 5', 'ie 8',
            'ie 9', 'opera 12.1', 'ios 6', 'android 4'
          ],
          cascade: true
        }));
      return compile;
    }
  });
  watcher.on('change', (event) => {
    if (event.type === 'changed') {
      plugins.util.log(
        plugins.util.colors.magenta('😂 Being compiled😝:'),
        plugins.util.colors.bgMagenta.bold(path.basename(event.path))
      );
    }
  })
});





















