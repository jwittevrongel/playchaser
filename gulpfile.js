'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    processhtml = require('gulp-processhtml'),
    htmlmin = require('gulp-htmlmin'),
    ngTemplates = require('gulp-ng-templates'),
    glob = require('glob'),
    eventstream = require('event-stream'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    replace = require('gulp-replace'),
    path = require('path'),
    mocha = require('gulp-mocha');    

var allJavascriptSources = ['gulpfile.js', 'server/**/*.js', 'client/**/*.js', '!client/lib/**/*'];
gulp.task('all-jshint', function() {
	return gulp.src(allJavascriptSources)
    	.pipe(jshint())
    	.pipe(jshint.reporter('default'))
    	.pipe(jshint.reporter('fail'));
});

var lessSources = ['client/css/*.less', '!client/css/_*.less'];
gulp.task('client-less', ['client-copy'], function() {
	var collectionFiles = gulp.src('bld/*.manifest.json');
	var lessTask = gulp.src(lessSources, { base: 'client' })
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

var clientMainHtml = 'client/*.html';
var clientManifestFiles = 'bld/*.manifest.json';
function htmlTask() {
	 var files = glob.sync(clientMainHtml),
     	streams = files.map(function(file) {
         	return gulp.src(file)
         		 .pipe(replace(' ng-app=', ' ng-strict-di ng-app='))
                 .pipe(processhtml(file));
     	}).concat(gulp.src(clientManifestFiles));

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
}
gulp.task('client-html-build', ['rev-all'], htmlTask);
gulp.task('client-html-watched', htmlTask);

var clientLibs = 'client/lib/**/*';
gulp.task('client-copy-lib', function() {
	return gulp.src(clientLibs)
		.pipe(gulp.dest('static/lib'));
});

var clientFilesToCopy = ['client/font/**/*', 'client/img/**/*'];
gulp.task('client-copy', function() {
	return gulp.src(clientFilesToCopy, {base: path.join(process.cwd(), 'client')})
		.pipe(rev())
		.pipe(gulp.dest('static'))
		.pipe(rev.manifest({path:'client-copy.manifest.json'}))
		.pipe(gulp.dest('bld'));
});

var clientMainJsFiles = ['client/js/index.js', 'client/js/login.js', 'client/js/production-mode.js'];
gulp.task('client-main-js', function() {
	return eventstream.merge.apply(eventstream, ['index', 'login'].map(function(mainfile) {
		return gulp.src(['client/js/' + mainfile + '.js', 'client/js/production-mode.js'], {base: 'client'})
			.pipe(ngAnnotate({add: true}))
			.pipe(concat('js/' + mainfile + '.min.js'))
			.pipe(uglify('js/' + mainfile + '.min.js'))
			.pipe(rev())
			.pipe(gulp.dest('static'))
			.pipe(rev.manifest({path:'client-main-js-' + mainfile + '.manifest.json'}))
			.pipe(gulp.dest('bld'));
		})
	);
});

var clientHtmlTemplates = ['client/js/**/*.html'];
gulp.task('client-template-js', function() {
	return gulp.src(clientHtmlTemplates)
		.pipe(htmlmin({
	 					removeComments: true,
	 					collapseWhitespace: true,
	 					collapseBooleanAttributes: true,
	 					removeAttributeQuotes: true,
	 					removeRedundantAttributes: true,
	 					removeEmptyAttributes: true
	 				}))
		.pipe(ngTemplates({ module: 'playchaser', filename: '_templates.js', standalone: false, path: function (path, base) {
                return path.replace(base, 'js/');
            } 
        }))
		
		.pipe(header('(function(angular){\n"use strict";\n'))
		.pipe(footer('\n})(angular);'))
		.pipe(gulp.dest('client/js'));
});

var clientPlaychaserJsFiles = ['client/js/playchaser.js', 'client/js/**/*.js', '!client/js/index.js', '!client/js/login.js', '!client/js/environment-test.js', '!client/js/production-mode.js'];
gulp.task('client-playchaser-js', ['client-template-js'], function() {
	return gulp.src(clientPlaychaserJsFiles, {base: 'client'})
		.pipe(ngAnnotate({add: true}))
		.pipe(concat('js/playchaser.min.js'))
		.pipe(uglify('js/playchaser.min.js'))
		.pipe(rev())
		.pipe(gulp.dest('static'))
		.pipe(rev.manifest({path:'client-playchaser-js.manifest.json'}))
		.pipe(gulp.dest('bld'));
});

var allServerJsFiles = ['server/**/*.js'];
gulp.task('server-test', function() {
	return gulp.src(['server/**/*-test.js'], { read: false })
		.pipe(mocha());
});

// no client tests yet
gulp.task('client-test'); 

gulp.task('watch', function() {
	gulp.watch(allJavascriptSources, ['all-jshint']);
	gulp.watch(lessSources, ['client-less']);
	gulp.watch(clientFilesToCopy, ['client-copy']);
	gulp.watch([clientMainHtml, clientManifestFiles], ['client-html-watched']);
	gulp.watch(clientMainJsFiles, ['client-main-js']);
	gulp.watch(clientHtmlTemplates, ['client-playchaser-js']);
	gulp.watch(clientPlaychaserJsFiles.concat('!client/js/_templates.js'), ['client-playchaser-js']);
	gulp.watch(allServerJsFiles, ['server-test']);
});

gulp.task('all-test', ['server-test', 'client-test']);
gulp.task('rev-all', ['client-less', 'client-js', 'client-copy']);
gulp.task('client-js', ['client-main-js', 'client-playchaser-js']);
gulp.task('client-all', ['client-less', 'client-html-build', 'client-js', 'client-copy', 'client-copy-lib']);
gulp.task('default', ['all-jshint', 'all-test', 'client-all']);


