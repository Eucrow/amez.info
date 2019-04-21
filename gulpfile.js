'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

var responsive = require('gulp-responsive-images');

var webp = require('gulp-webp');
 
// copy required files to dist folder
function copyToDistFolder(){
  return gulp.src('./index.html')
      .pipe(gulp.dest('../amez.info.dist'))
      .pipe(browserSync.stream());
}

// copy required files to imgs folder
function copyToImgsFolder(){
  return gulp.src('./imgs/*.{svg,jpg,webp}')
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
  gulp.watch("./imgs/*.{svg,jpg,webp}").on('change', copyToImgsFolder);
}

// Run static server and watch files
gulp.task("default", gulp.parallel(
  copyToImgsFolder,
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

/**
 * Export images to responsive resolutions and export to webp format.
 * Take images from img/originals directory.
 * Use only when images has been changed.
 */
gulp.task('responsiveImages', function(){
  return gulp.src('original_images/*.jpg') // WARNING: can't be spaces between 'jpg,' and 'png'
      .pipe(responsive({ // create responsive images
          '*.jpg':[
              { width: 400, quality: 90, suffix: "_400" },
              { width: 768, quality: 90, suffix: "_768" },
              { width: 1280, quality: 85, suffix: "_1280" }
          ]
      }))
      .pipe(webp()) // export to webp format
      .pipe(gulp.dest('imgs/'))
})

