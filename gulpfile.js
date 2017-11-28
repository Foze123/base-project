var gulp = require('gulp'); // import the gulp module itself
gulp.task('copy-html-files', function () {
    var stream =  gulp.src('./public/views/**/*.html') // stream source
        .pipe(gulp.dest('./dist/views/')); // copy to dist/views
    return stream;
});

var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
gulp.task('css-files', function () {
    var stream = gulp.src('./public/index.html')
        .pipe(useref()) //take a streem from index.html comment
        .pipe(gulpif('*.css', minifyCss())) // if .css file, minify
        .pipe(gulpif('*.css', gulp.dest('./dist'))); // copy to dist
    return stream;
});

var wiredep = require('wiredep').stream;
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
gulp.task('bower-files', function () {
    var stream = gulp.src('./public/index.html')
        .pipe(wiredep({
            directory: 'bower_components' //inject dependencies
        }))
        .pipe(useref())
        .pipe(gulpif('*.js', ngAnnotate())) // ng-annotate if .js
        .pipe(gulpif('*.js', uglify())) // uglify if .js
        .pipe(gulpif('*.js', gulp.dest('./dist'))); // paste to dist
    return stream;
});


var runSequence = require('run-sequence');

gulp.task('build', function (callback) {
    runSequence(
        'css-files',
        'bower-files',
        'copy-html-files',
        /* other tasks maybe */
    callback);
});

var clean = require('gulp-clean');
gulp.task('clean', function () {
        var stream =  gulp.src('./dist', {read: false})
                      .pipe(clean());
        return stream
});

gulp.task('watch', function() {
    gulp.watch('./app/**/**/*.*', function () {
        runSequence('css-files', 'bower-files', 'copy-html-files');
    });
});