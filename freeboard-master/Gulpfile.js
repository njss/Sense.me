var gulp = require('gulp');
//,
        //sass = require('gulp-ruby-sass'),
        //autoprefixer = require('gulp-autoprefixer'),
        //minifycss = require('gulp-minify-css'),
        //rename = require('gulp-rename');

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(4000, '0.0.0.0');
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}
/*
gulp.task('styles', function() {
  return sass('sass', { style: 'expanded' })
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});
*/

gulp.task('watch', function() {
  //gulp.watch('sass/*.scss', ['styles']);
  gulp.watch('app/*.html', notifyLiveReload);
  gulp.watch('app/*.css', notifyLiveReload);
  gulp.watch('app/*.js', notifyLiveReload);
});

//gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {
gulp.task('default', ['express', 'livereload', 'watch'], function() {

});
