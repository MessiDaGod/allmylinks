import * as browserify from 'browserify';
import * as gulp from 'gulp';

gulp.task('browserify', function() {
    return browserify('./src/index.js')
        .bundle()
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function () {
    gulp.src('./src/index.js')
        .pipe(gulp.dest('../wwwroot/js/'));
});