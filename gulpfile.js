var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
	scss	: ['./sources/scss/ionic.app.scss', './sources/scss/**/*.scss'],
	angular : ['./sources/js/angular/angular-simple-logger.min.js', './sources/js/angular/angular-google-maps.min.js', './sources/js/angular/angular-locale_fr-fr.js', './sources/js/angular/angular-local-storage.min.js', './sources/js/angular/angular-slugify.js', './sources/js/angular/angular-ios9-uiwebview.patch.js'],
	tup		: ['./sources/js/tup/app.js', './sources/js/tup/controller*.js', './sources/js/tup/service*.js', './sources/js/tup/factory*.js']
};

gulp.task('default', ['sass', 'tup-angular', 'tup-app']);

gulp.task('sass', function(done) {
	gulp.src('./sources/scss/ionic.app.scss')
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(minifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename('tup.app.min.css'))
		.pipe(gulp.dest('./www/css/'))
		.on('end', done);
});

gulp.task('tup-angular', function(done) {
	gulp.src(['./sources/js/angular/angular-simple-logger.min.js', './sources/js/angular/angular-google-maps.min.js', './sources/js/angular/angular-locale_fr-fr.js', './sources/js/angular/angular-local-storage.min.js', './sources/js/angular/angular-slugify.js', './sources/js/angular/angular-ios9-uiwebview.patch.js'])
		.pipe(concat('angular.script.min.js'))
		.pipe(gulp.dest('./www/js'))
		.on('end', done);
});

gulp.task('tup-app', function(done) {
	gulp.src(['./sources/js/tup/app.js', './sources/js/tup/controller*.js', './sources/js/tup/service*.js', './sources/js/tup/factory*.js'])
		.pipe(concat('tup.app.min.js'))
		.pipe(gulp.dest('./www/js'))
		.on('end', done);
});

gulp.task('watch', function() {
	gulp.watch(paths.scss, ['sass']);
	gulp.watch(paths.angular, ['tup-angular']);
	gulp.watch(paths.tup, ['tup-app']);
});

gulp.task('install', ['git-check'], function() {
	return bower.commands.install()
	.on('log', function(data) {
		gutil.log('bower', gutil.colors.cyan(data.id), data.message);
	});
});

gulp.task('git-check', function(done) {
	if (!sh.which('git')) {
		console.log(
			'  ' + gutil.colors.red('Git is not installed.'),
			'\n  Git, the version control system, is required to download Ionic.',
			'\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
			'\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
		);
		process.exit(1);
	}
	done();
});
