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


gulp.task('default', gulp.series('typescript'));

