const { src, dest }  = require("gulp");
const minify = require("gulp-minify");

function minifyjs() {

    return src('src/js/main.js', { allowEmpty: true })
        .pipe(minify({noSource: true}))
        .pipe(dest('public/js'))
}

exports.default = minifyjs;