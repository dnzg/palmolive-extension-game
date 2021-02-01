var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://localhost",
        https: {
            key: "conf/server.key",
            cert: "conf/server.crt"
            }
    });

    gulp.watch("public").on("change", reload);
});