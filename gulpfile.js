"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();

sass.compiler = require("node-sass");

var responsive = require("gulp-responsive-images");

var webp = require("gulp-webp");

const cleanCSS = require("gulp-clean-css");

const htmlmin = require("gulp-htmlmin");

// minify css
// minify css of distribution folder
gulp.task("minify-css", () => {
  return gulp
    .src("../amez.info.dist/css/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("../amez.info.dist/css"));
});

gulp.task("minify-html", () => {
  return gulp
    .src("../amez.info.dist/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("../amez.info.dist/"));
});

gulp.task("minify", gulp.parallel("minify-css", "minify-html"));

// copy required files to dist folder
function copyToDistFolder() {
  return gulp
    .src("./index.html")
    .pipe(gulp.dest("../amez.info.dist"))
    .pipe(browserSync.stream());
}

// copy required files to imgs folder
function copyToImgsFolder() {
  return gulp
    .src("./imgs/*.{svg,jpg,webp}")
    .pipe(gulp.dest("../amez.info.dist/imgs"))
    .pipe(browserSync.stream());
}

// sass compiler
function compileSass() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("../amez.info.dist/css"))
    .pipe(browserSync.stream());
}

// watch files
function watchFiles() {
  gulp.watch("./scss/*.scss", compileSass);
  gulp.watch("./*.html").on("change", copyToDistFolder);
  gulp.watch("./imgs/*.{svg,jpg,webp}").on("change", copyToImgsFolder);
}

// Run static server and watch files
gulp.task(
  "default",
  gulp.parallel(copyToImgsFolder, watchFiles, function () {
    browserSync.init({
      server: "../amez.info.dist",
      //server: "./",
      port: 8000,
      browser: "chrome",
    });
  })
);

/**
 * Export images to responsive resolutions and export to webp format.
 * Take images from img/originals directory.
 * Use only when images has been changed.
 */
gulp.task("responsiveImages", function () {
  return gulp
    .src("original_images/*.jpg") // WARNING: can't be spaces between 'jpg,' and 'png'
    .pipe(
      responsive({
        // create responsive images
        "*.jpg": [
          { width: 400, quality: 90, suffix: "_400" },
          { width: 768, quality: 90, suffix: "_768" },
          { width: 1280, quality: 85, suffix: "_1280" },
        ],
      })
    )
    .pipe(webp()) // export to webp format
    .pipe(gulp.dest("imgs/"));
});
