var gulp = require('gulp');
// var styleguide = require('sc5-styleguide');
// var outputPath = 'styleguideoutput';
// var sass = require('gulp-sass');
//,
        //sass = require('gulp-ruby-sass'),
        //autoprefixer = require('gulp-autoprefixer'),
        //minifycss = require('gulp-minify-css'),
        //rename = require('gulp-rename');

// gulp.task('styleguide:generate', function() {
//   return gulp.src('app/*.html')
//     .pipe(styleguide.generate({
//         title: 'My Styleguide',
//         server: true,
//         rootPath: outputPath,
//         overviewPath: 'README.md'
//       }))
//     .pipe(gulp.dest(outputPath));
// });

// gulp.task('styleguide:applystyles', function() {
//   return gulp.src('main.scss')
//     .pipe(sass({
//       errLogToConsole: true
//     }))
//     .pipe(styleguide.applyStyles())
//     .pipe(gulp.dest(outputPath));
// });        

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname + '/app'));
  app.listen(4000, '0.0.0.0');
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname + '/app', event.path);

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

// gulp.task('watch', ['styleguide'], function() {
//   //gulp.watch('sass/*.scss', ['styles']);
//   gulp.watch(['app/**/*.html'], ['styleguide'], notifyLiveReload);
//   gulp.watch(['app/css/*'], ['styleguide'], notifyLiveReload);
//   gulp.watch(['app/**/*.js'], ['styleguide'], notifyLiveReload);
// });

gulp.task('watch', function() {
  //gulp.watch('sass/*.scss', ['styles']);
  gulp.watch(['app/**/*.html'], notifyLiveReload);
  gulp.watch(['app/css/*'], notifyLiveReload);
  gulp.watch(['app/**/*.js'], notifyLiveReload);
});

//gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {
// gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);
// gulp.task('default', ['express', 'livereload', 'watch'], function() {

// });

gulp.task('default', ['express', 'watch'], function() {

});
