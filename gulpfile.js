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
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('all-jshint', function() {
	return gulp.src(['gulpfile.js', 'server/**/*.js', 'client/**/*.js', '!client/lib/**/*'])
    	.pipe(jshint())
    	.pipe(jshint.reporter('default'))
    	.pipe(jshint.reporter('fail'));
});

gulp.task('client-less', function() {
	return gulp.src(['client/css/*.less', '!client/css/_*.less'])
		.pipe(less())
		.pipe(gulp.dest('client/css'))
		.pipe(cssmin())
		.pipe(rename({ extname: ".min.css" }))
		.pipe(gulp.dest('static/css'));
});

gulp.task('client-html', function() {
	var files = glob.sync('client/*.html'),
    	streams = files.map(function(file) {
        	return gulp.src(file)
                .pipe(processhtml(file));
    	});

    return eventstream.merge.apply(eventstream, streams)
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

gulp.task('client-copy', function() {
	return eventstream.merge.apply(eventstream, ['lib', 'font', 'img'].map(function(path) {
		return gulp.src('client/' + path + '/**/*')
			.pipe(gulp.dest('static/' + path));
	}));
});

gulp.task('client-main-js', function() {
	return eventstream.merge.apply(eventstream, ['index', 'login'].map(function(mainfile) {
		return gulp.src('client/js/' + mainfile + '.js')
			.pipe(ngAnnotate({add: true}))
			.pipe(uglify(mainfile + '.min.js'))
			.pipe(gulp.dest('static/js'));
		})
	);
});

gulp.task('client-playchaser-js', function() {
	return gulp.src(['client/js/playchaser.js', 'client/js/**/*.js', '!client/js/index.js', '!client/js/login.js', '!client/js/environment_test.js'])
		.pipe(ngAnnotate({add: true}))
		.pipe(uglify('playchaser.min.js'))
		.pipe(gulp.dest('static/js'));
});

gulp.task('client-js', ['client-main-js', 'client-playchaser-js']);
gulp.task('client-all', ['client-less', 'client-html', 'client-js', 'client-copy']);
gulp.task('default', ['all-jshint', 'client-all']);
