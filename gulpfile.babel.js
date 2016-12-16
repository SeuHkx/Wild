/**
 * Created by hkx on 2016/11/15.
 */
'use strict';
import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
import path from 'path';
import browserSync from 'browser-sync';
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
const AUTO_PREFIXER = [
    'last 2 version',
    'safari 5',
    'ie 8',
    'ie 9',
    'opera 12.1',
    'ios 6',
    'android 4'
];
const BROWSER_PORT = 3333;
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
            changeFile = arrPath.join('/') + '/modules/' + reflectionFile;
            return changeFile;
        }
        return false;
    }
};
const bs = browserSync.create();
const plugins = gulpPlugins(opts);
const ts = plugins.ts.createProject('tsconfig.json', {
    target: 'es5',
    rootDir: './components',
    outDir: './build'
});
const pugServeWatchExc = (event)=>{
    let dist = path.dirname(event.path);
    gulp.src(file.changeFile(event))
        .pipe(plugins.plumber())
        .pipe(plugins.pug({
            doctype: 'html',
            pretty: true
        }))
        .pipe(plugins.rename({
            basename: 'index'
        }))
        .pipe(gulp.dest(dist))
        .pipe(bs.stream({once: true}));
    plugins.util.log(
        plugins.util.colors.magenta.bold('😂 Being compiled pug 😝 😝:'),
        plugins.util.colors.bgMagenta.bold(path.basename(event.path))
    );
};
gulp.task('sass', ['minify'], () => {
    const watcher = gulp.watch('sass/**/*.scss', event => {
        let compile;
        if (event.type === 'changed' || event.type === 'added') {
            let [changeFile,compilePrivateFile] = [file.changeFile(event), file.compilePrivateFile(event)];
            compile = gulp.src(compilePrivateFile ? compilePrivateFile : changeFile)
                .pipe(plugins.plumber())
                .pipe(plugins.sassLint(sassLintConfig))
                .pipe(plugins.sassLint.format())
                .pipe(plugins.sassLint.failOnError())
                .pipe(plugins.sass().on('error', plugins.sass.logError))
                .pipe(plugins.prefix({
                    browsers: AUTO_PREFIXER,
                    cascade: true
                }))
                .pipe(bs.stream({once: true}));
            return compile;
        }
    });
    watcher.on('change', (event) => {
        if (event.type === 'changed') {
            plugins.util.log(
                plugins.util.colors.magenta.bold('😂 Being compiled😝:'),
                plugins.util.colors.bgMagenta.bold(path.basename(event.path))
            );
        }
    });
    gulp.watch('sass/**/*.scss', ['minify']);
});
gulp.task('minify', () => {
    return gulp.src('sass/wild.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.prefix({
            browsers: [
                'last 2 version', 'safari 5', 'ie 8',
                'ie 9', 'opera 12.1', 'ios 6', 'android 4'
            ],
            cascade: false
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.cleanCSS(
            {
                compatibility: 'ie8',
                debug: true
            }, (details) => {
                plugins.util.log(
                    plugins.util.colors.magenta('Before' + details.name + ':') + plugins.util.colors.bgMagenta.bold(Math.floor(details.stats.originalSize / 1024) + 'KB'),
                    plugins.util.colors.magenta('After ' + details.name + ':') + plugins.util.colors.bgMagenta.bold(Math.floor(details.stats.minifiedSize / 1024) + 'KB')
                );
            }))
        .pipe(gulp.dest('dist/'));
});
gulp.task('serve', ['pug'], () => {
    bs.init({
        server: {
            baseDir: './',
            index: './docs/index.html',
            routes: {
                '/docs': 'docs'
            }
        },
        port: BROWSER_PORT
    });
    plugins.$w('./docs/**/*.pug',pugServeWatchExc);
    gulp.watch('./sass/**/*.scss',['minify']);
    gulp.watch('./dist/**/*.css').on('change', bs.reload);
    gulp.watch('./docs/**/*.html').on('change', bs.reload);
});
gulp.task('pug', () => {
    return gulp.src('docs/**/*.pug')
        .pipe(plugins.plumber())
        .pipe(plugins.pug({
            doctype: 'html',
            pretty: true
        }))
        .pipe(plugins.rename({
            basename: 'index'
        }))
        .pipe(gulp.dest('docs/'))
        .pipe(bs.stream({once: true}));
});
gulp.task('pug:watch', () => {
    return plugins.$w('docs/**/*.pug', event => {
        let dist = path.dirname(event.path);
        gulp.src(file.changeFile(event))
            .pipe(plugins.plumber())
            .pipe(plugins.pug({
                doctype: 'html',
                pretty: true
            }))
            .pipe(plugins.rename({
                basename: 'index'
            }))
            .pipe(gulp.dest(dist))
            .pipe(bs.stream({once: true}));
        plugins.util.log(
            plugins.util.colors.magenta.bold('😂 Being compiled pug 😝 😝:'),
            plugins.util.colors.bgMagenta.bold(path.basename(event.path))
        );
    });
});
gulp.task('ts', () => {
    return ts.src()
        .pipe(ts())
        .js.pipe(gulp.dest('build'));
});
gulp.task('default', ['serve']);
