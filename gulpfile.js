'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');
 
// copy required files to dist folder
function copyToDistFolder(){
  return gulp.src('./index.html')
      .pipe(gulp.dest('../amez.info.dist'))
      .pipe(browserSync.stream());
}

// copy required files to imgs folder
function copyToImgsFolder(){
  return gulp.src('./imgs/*.svg')
      .pipe(gulp.dest('../amez.info.dist/imgs'))
      .pipe(browserSync.stream());
}

// sass compiler
function compileSass(){
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../amez.info.dist/css'))
    .pipe(browserSync.stream());
}

// watch files
function watchFiles(){
  gulp.watch('./scss/*.scss', compileSass);
  gulp.watch("./*.html").on('change', copyToDistFolder);
  gulp.watch("./imgs/*.svg").on('change', copyToImgsFolder);
}

// Run static server and watch files
gulp.task("default", gulp.parallel(
  watchFiles, 
  function() {
    browserSync.init({
        server: "../amez.info.dist",
        //server: "./",
        port: 8000,
        browser: 'chrome'
    });
  }
));

