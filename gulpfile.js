var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var outDir = 'out';


gulp.task('typescript', function (done) {
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(outDir))
        .on('end', done); // Signal async completion
});

gulp.task('copy-python', function (done) {
    gulp.src('src/dts_formatter.py')
        .pipe(gulp.dest(outDir + '/src'))
        .on('end', done); // Signal async completion
});

gulp.task('default', gulp.series('typescript', 'copy-python'));

