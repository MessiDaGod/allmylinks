const {
    src,
    dest
} = require('gulp');
const beautify = require('gulp-jsbeautifier');

function beaut() {
    src('./dist/js/bundle.js')
        .pipe(beautify())
        .pipe(dest('../wwwroot/js/'));
    return copy();
}

function copy() {
    src('./src/index.js')
        .pipe(dest('./dist/bundle.js/'));
}

exports.default = beaut;