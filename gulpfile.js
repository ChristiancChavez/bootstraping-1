// Gulp.js configuration
var
    // modules
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    htmlclean = require('gulp-htmlclean'),
    babel = require('gulp-babel')
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano'),
    browserSync = require('browser-sync').create()
    reload = browserSync.reload


// development mode?
devBuild = (process.env.NODE_ENV !== 'production'),

    // folders
    folder = {
        src: 'src/',
        build: 'build/'
    }
    ;


// image processing
gulp.task('images', function () {
    var out = folder.build + 'images/';
    return gulp.src(folder.src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 7 }))
        .pipe(gulp.dest(out));
});

gulp.task('js', function () {

    var jsbuild = gulp.src(folder.src + 'js/**/*')
        .pipe(deporder())
        .pipe(concat('controller.js'));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(uglify());
    }

    return jsbuild
        .pipe(babel({
            presets: [
                ['@babel/preset-env',
                {
                    "targets": {
                        "ie": "11"
                    }
                }]
            ],
        }))
        .pipe(gulp.dest(folder.build));

});

// CSS processing
gulp.task('css', gulp.series('images', function () {

    var postCssOpts = [
        assets({ loadPaths: ['images/'] }),
        autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
        mqpacker
    ];

    if (!devBuild) {
        postCssOpts.push(cssnano);
    }

    return gulp.src(folder.src + 'sass/styles.sass')
        .pipe(sass({
            outputStyle: 'nested',
            imagePath: 'images/',
            precision: 3,
            errLogToConsole: true
        }))
        .pipe(postcss(postCssOpts))
        .pipe(gulp.dest(folder.build));

}));

gulp.task('html', function () {
    var
        out = folder.build,
        page = gulp.src(folder.src + '**/*.html')
            .pipe(newer(out));

    // minify production code
    if (!devBuild) {
        page = page.pipe(htmlclean());
    }

    return page.pipe(gulp.dest(out));
});

// watch for changes
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
    // javascript changes
    gulp.watch(folder.src + 'js/**/*', gulp.parallel('js', reload));
    // css changes
    gulp.watch(folder.src + 'sass/**/*', gulp.parallel('css', reload));
    // image changes
    gulp.watch(folder.src + 'images/**/*', gulp.parallel('images'));
    // html changes
    gulp.watch(folder.src + '**/*.html', gulp.series('html', reload));
});



gulp.task('run', gulp.parallel('html', 'css', 'js'));


// default task
gulp.task('default', gulp.series('run', 'watch'));
