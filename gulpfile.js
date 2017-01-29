var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  typescript = require('gulp-typescript'),
  webserver = require('gulp-webserver'),
  tscConfig = require('./tsconfig.json'),
  del = require('del'),
  runSequence = require('run-sequence');

var appSrc = './dist/';
var tsProject = typescript.createProject('tsconfig.json');

gulp.task('build', function (callback) {
  runSequence('clean', ['copylibs', 'copystatic', 'typescript'], callback);
});

gulp.task('clean', function () {
  return del(appSrc);
});

gulp.task('copylibs', function () {
  return gulp
    .src([
        'core-js/client/shim.min.js',
        'systemjs/dist/system-polyfills.js',
        'systemjs/dist/system.src.js',
        'reflect-metadata/Reflect.js',
        'rxjs/**/*.js',
        'zone.js/dist/**',
        '@angular/**/bundles/**'
      ], {cwd: "node_modules/**"}) 
      .pipe(gulp.dest(appSrc + 'lib'));
});

gulp.task('typescript', function () {
  return gulp
    .src(['src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(appSrc));
});

var staticFiles = [
  'src/**/*.html',
  'src/**/*.css',
  'src/**/*.ico',
  'src/**/*.png',
  'src/**/*.svg',
  'src/**/*.jpg',
  'src/**/*.ttf',
  'src/**/*.woff2',
  'src/**/*.webapp',
  'src/systemjs.config.js'
];
gulp.task('copystatic', function () {

  return gulp.src(["src/**/*", "!**/*.ts"])
        .pipe(gulp.dest(appSrc));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.ts', ['typescript']);
  gulp.watch(staticFiles, ['copystatic']);
});

gulp.task('webserver', function () {
  gulp.src(appSrc)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('default', function (callback) {
  runSequence('clean', 'build', ['watch', 'webserver'], callback);
});