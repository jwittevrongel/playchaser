'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    processhtml = require('gulp-processhtml'),
    htmlmin = require('gulp-htmlmin'),
    glob = require('glob'),
    eventstream = require('event-stream'),
    uglify = require('gulp-uglifyjs'),
    ngAnnotate = require('gulp-ng-annotate'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    path = require('path');    

gulp.task('all-jshint', function() {
	return gulp.src(['gulpfile.js', 'server/**/*.js', 'client/**/*.js', '!client/lib/**/*'])
    	.pipe(jshint())
    	.pipe(jshint.reporter('default'))
    	.pipe(jshint.reporter('fail'));
});

gulp.task('client-less', ['client-copy'], function() {
	var collectionFiles = gulp.src('bld/*.manifest.json');
	var lessTask = gulp.src(['client/css/*.less', '!client/css/_*.less'], { base: 'client' })
		.pipe(less())
		.pipe(gulp.dest('client'));

	return eventstream.merge(collectionFiles, lessTask)
		.pipe(revCollector())
		.pipe(cssmin())
		.pipe(rename({ extname: ".min.css" }))
		.pipe(rev())
		.pipe(gulp.dest('static'))
		.pipe(rev.manifest({path:'client-less.manifest.json'}))
		.pipe(gulp.dest('bld'));
});

gulp.task('client-html', ['rev-all'], function() {
	 var files = glob.sync('client/*.html'),
     	streams = files.map(function(file) {
         	return gulp.src(file)
                 .pipe(processhtml(file));
     	}).concat(gulp.src('bld/*.manifest.json'));

     return eventstream.merge.apply(eventstream, streams)
     	.pipe(revCollector())
     	.pipe(htmlmin({
	 					removeComments: true,
	 					collapseWhitespace: true,
	 					collapseBooleanAttributes: true,
	 					removeAttributeQuotes: true,
	 					removeRedundantAttributes: true,
	 					removeEmptyAttributes: true
	 				}))
     	.pipe(rename({dirname: '.'}))
	 	.pipe(gulp.dest('static'));
});

gulp.task('client-copy-lib', function() {
	return gulp.src('client/lib/**/*')
		.pipe(gulp.dest('static/lib'));
});

gulp.task('client-copy', function() {
	return gulp.src(['client/font/**/*', 'client/img/**/*'], {base: path.join(process.cwd(), 'client')})
		.pipe(rev())
		.pipe(gulp.dest('static'))
		.pipe(rev.manifest({path:'client-copy.manifest.json'}))
		.pipe(gulp.dest('bld'));
});

gulp.task('client-main-js', function() {
	return eventstream.merge.apply(eventstream, ['index', 'login'].map(function(mainfile) {
		return gulp.src('client/js/' + mainfile + '.js', {base: 'client'})
			.pipe(ngAnnotate({add: true}))
			.pipe(uglify('js/' + mainfile + '.min.js'))
			.pipe(rev())
			.pipe(gulp.dest('static'))
			.pipe(rev.manifest({path:'client-main-js-' + mainfile + '.manifest.json'}))
			.pipe(gulp.dest('bld'));
		})
	);
});

gulp.task('client-playchaser-js', function() {
	return gulp.src(['client/js/playchaser.js', 'client/js/**/*.js', '!client/js/index.js', '!client/js/login.js', '!client/js/environment_test.js'], {base: 'client'})
		.pipe(ngAnnotate({add: true}))
		.pipe(uglify('js/playchaser.min.js'))
		.pipe(rev())
		.pipe(gulp.dest('static'))
		.pipe(rev.manifest({path:'client-playchaser-js.manifest.json'}))
		.pipe(gulp.dest('bld'));
});

gulp.task('rev-all', ['client-less', 'client-js', 'client-copy']);
gulp.task('client-js', ['client-main-js', 'client-playchaser-js']);
gulp.task('client-all', ['client-less', 'client-html', 'client-js', 'client-copy', 'client-copy-lib']);
gulp.task('default', ['all-jshint', 'client-all']);
