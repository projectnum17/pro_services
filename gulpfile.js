'use strict';

const { src, dest, watch, parallel, series } = require('gulp');
const gulpif = require('gulp-if');
const { argv } = require('yargs');

// Определяем режим: gulp --prod или gulp build --prod
const isProd = !!argv.prod;
const isDev = !isProd;

// Стили
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');

// Скрипты и HTML
const panini = require('panini');
const strip = require('gulp-strip-comments');
const htmlbeautify = require('gulp-html-beautify');
const bemValidator = require('gulp-html-bem-validator');
const webpack = require('webpack-stream');
const named = require('vinyl-named');

// Шрифты
const fonter = require('gulp-fonter-unx');
const ttf2woff2 = require('gulp-ttf2woff2');

// Инструменты
const rename = require('gulp-rename');
const del = require('del');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const replace = require('gulp-replace');

// PATHS
const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html: distPath,
        css: distPath + 'assets/css/',
        js: distPath + 'assets/js/',
        images: distPath + 'assets/images/',
        fonts: distPath + 'assets/fonts/',
        video: distPath + 'assets/video/',
    },
    src: {
        html: srcPath + '*.html',
        css: srcPath + 'assets/scss/*.scss',
        js: srcPath + 'assets/js/*.js',
        images: srcPath + 'assets/images/**/*.+(png|jpg|gif|ico|svg|webp)',
        fonts: srcPath + 'assets/fonts/**/*.{ttf,otf,woff,woff2,eot,svg}',
        video: srcPath + 'assets/video/**/*.+(mp4|webm|avi|mov|png|jpg)',
    },
    watch: {
        html: srcPath + '**/*.html',
        css: srcPath + 'assets/scss/**/*.scss',
        js: srcPath + 'assets/js/**/*.js',
        libs: srcPath + 'assets/libs/**/*.js',
        images: srcPath + 'assets/images/**/*.+(png|jpg|gif|ico|svg|webp)',
        fonts: srcPath + 'assets/fonts/**/*',
        video: srcPath + 'assets/video/**/*.+(mp4|webm|avi|mov|png|jpg)',
    },
    clean: './' + distPath,
};

// Обработка ошибок с динамическим заголовком
function plumberNotify(title) {
    return plumber({
        errorHandler: notify.onError({
            title: title || 'Gulp Error',
            message: '<%= error.message %>',
            sound: false,
        }),
    });
}

// SERVER
function serve() {
    browserSync.init({
        server: { baseDir: './' + distPath },
        notify: false,
    });
}

// HTML
function html() {
    panini.refresh();
    return src(path.src.html, { base: srcPath })
        .pipe(plumberNotify('HTML Error'))
        .pipe(
            panini({
                root: srcPath,
                layouts: srcPath + 'templates/layouts/',
                defaultLayout: false,
                partials: [
                    srcPath + 'templates/partials/',
                    srcPath + 'templates/components/',
                ],
                helpers: srcPath + 'templates/helpers/',
                data: srcPath + 'templates/data/',
            }),
        )
        .pipe(replace('@@suffix', isProd ? '.min' : ''))
        .pipe(bemValidator())
        .pipe(gulpif(isProd, strip())) // Удаляем комментарии только в PROD
        .pipe(
            htmlbeautify({
                indent_size: 4,
                indent_char: ' ',
                unformatted: [],
                inline: [],
                indent_inner_html: true,
                max_preserve_newlines: 1,
                extra_liners: [],
            }),
        )
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));
}

// STYLES
function css() {
    return (
        src(path.src.css)
            .pipe(plumberNotify('CSS/SCSS Error'))
            .pipe(gulpif(isDev, sourcemaps.init()))
            .pipe(
                sass({
                    outputStyle: 'expanded',
                    includePaths: ['node_modules'],
                }),
            )
            .pipe(
                autoprefixer({
                    cascade: true,
                    grid: false,
                }),
            )
            .pipe(gulpif(isProd, gcmq()))
            // Если PROD — сжимаем и добавляем суффикс .min
            .pipe(
                gulpif(
                    isProd,
                    cleancss({ level: { 1: { specialComments: 0 } } }),
                ),
            )
            .pipe(gulpif(isProd, rename({ suffix: '.min' })))

            // Если DEV — генерируем карты кода (рядом с несжатым файлом)
            .pipe(gulpif(isDev, sourcemaps.write('.')))

            // ОДНО финальное сохранение.
            // В DEV сюда придет style.css и style.css.map
            // В PROD сюда придет только style.min.css
            .pipe(dest(path.build.css))
            // ----------------------------------------------------
            .pipe(browserSync.reload({ stream: true }))
    );
}

// SCRIPTS
function js() {
    return src(path.src.js)
        .pipe(plumberNotify('JS Error'))
        .pipe(named())
        .pipe(
            webpack({
                mode: isProd ? 'production' : 'development',
                output: {
                    filename: isProd ? '[name].min.js' : '[name].js',
                },
                module: {
                    rules: [
                        {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                },
                            },
                        },
                    ],
                },
                devtool: isDev ? 'source-map' : false,
            }),
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
}

// IMAGES
function images() {
    return src(path.src.images)
        .pipe(plumberNotify('Images Error'))
        .pipe(newer(path.build.images))
        .pipe(
            gulpif(
                isProd,
                imagemin([
                    imagemin.gifsicle({ interlaced: true }),
                    imagemin.mozjpeg({ quality: 85, progressive: true }),
                    imagemin.optipng({ optimizationLevel: 5 }),
                    imagemin.svgo({ plugins: [{ removeViewBox: true }] }),
                ]),
            ),
        )
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({ stream: true }));
}

// VIDEO
function video() {
    return src(path.src.video)
        .pipe(plumberNotify('Video Error'))
        .pipe(newer(path.build.video)) // Пропускает файлы, которые уже есть в dist
        .pipe(dest(path.build.video))
        .pipe(browserSync.reload({ stream: true }));
}

// FONTS
function fonts() {
    return src(path.src.fonts)
        .pipe(plumberNotify('Fonts Error'))
        .pipe(newer(path.build.fonts))
        .pipe(fonter({ formats: ['woff', 'ttf'] }))
        .pipe(src(srcPath + 'assets/fonts/**/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({ stream: true }));
}

// CLEAN
function clean() {
    return del(path.clean);
}

// WATCHER
function watchFiles() {
    watch([path.watch.html], html);
    watch([path.watch.css], css);
    watch([path.watch.js, path.watch.libs], js);
    watch([path.watch.images], images);
    watch([path.watch.fonts], fonts);
    watch([path.watch.video], video);
}

// TASKS
const build = series(clean, parallel(html, css, js, images, fonts, video));
const dev = series(build, parallel(watchFiles, serve));

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.video = video;
exports.clean = clean;
exports.build = build;
exports.default = dev;
