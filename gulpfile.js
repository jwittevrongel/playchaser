'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var processhtml = require('gulp-processhtml');
var htmlmin = require('gulp-htmlmin');
var ngTemplates = require('gulp-ng-templates');
var glob = require('glob');
var eventstream = require('event-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var header = require('gulp-header');
var footer = require('gulp-footer');
var replace = require('gulp-replace');
var path = require('path');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');

var allJavascriptSources = [
  'gulpfile.js',
  'server/**/*.js',
  'client/**/*.js',
  '!client/lib/**/*',
];

gulp.task('all-jshint', function() {
  return gulp.src(allJavascriptSources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('all-jscs', function() {
  return gulp.src(allJavascriptSources)
    .pipe(jscs({fix: true}))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest('.'));
});

var lessSourcesAll = ['client/css/*.less'];
var lessSources = lessSourcesAll.concat('!client/css/_*.less');
gulp.task('client-less', ['client-copy'], function() {
  var collectionFiles = gulp.src('bld/*.manifest.json');
  var lessTask = gulp.src(lessSources, { base: 'client' })
    .pipe(less())
    .pipe(gulp.dest('client'));

  return eventstream.merge(collectionFiles, lessTask)
    .pipe(revCollector())
    .pipe(cssmin())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(rev())
    .pipe(gulp.dest('static'))
    .pipe(rev.manifest({path: 'client-less.manifest.json'}))
    .pipe(gulp.dest('bld'));
});

var clientMainHtml = 'client/*.html';
var clientManifestFiles = 'bld/*.manifest.json';
function htmlTask() {
  var files = glob.sync(clientMainHtml);
  var streams = files.map(function(file) {
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
      removeEmptyAttributes: true,
      minifyJS: true,
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
    .pipe(rev.manifest({path: 'client-copy.manifest.json'}))
    .pipe(gulp.dest('bld'));
});

var clientIndexJsFiles = ['client/js/index.js', 'client/js/production-mode.js'];
gulp.task('client-index-js', function() {
  return gulp.src(clientIndexJsFiles, {base: 'client'})
    .pipe(ngAnnotate({add: true}))
    .pipe(concat('js/index.min.js'))
    .pipe(uglify('js/index.min.js'))
    .pipe(rev())
    .pipe(gulp.dest('static'))
    .pipe(rev.manifest({path: 'client-index-js.manifest.json'}))
    .pipe(gulp.dest('bld'));
});

var clientLoginJsFiles = ['client/js/login.js', 'client/js/production-mode.js'];
gulp.task('client-login-js', function() {
  return gulp.src(clientLoginJsFiles, {base: 'client'})
    .pipe(ngAnnotate({add: true}))
    .pipe(concat('js/login.min.js'))
    .pipe(uglify('js/login.min.js'))
    .pipe(rev())
    .pipe(gulp.dest('static'))
    .pipe(rev.manifest({path: 'client-login-js.manifest.json'}))
    .pipe(gulp.dest('bld'));
});

var coreHtmlTemplates = ['client/js/core/**/*.html'];
gulp.task('core-template-html', function() {
  return gulp.src(coreHtmlTemplates)
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
    }))
    .pipe(ngTemplates({
      module: 'playchaser',
      filename: '_templates.js',
      standalone: false,
      path: function(path, base) {
        return path.replace(base, 'js/core/');
      },
    }))
		.pipe(header('(function(angular){\n"use strict";\n'))
		.pipe(footer('\n})(angular);'))
		.pipe(gulp.dest('client/js/core'));
});

var clientCoreJsFiles = ['client/js/core/module.js', 'client/js/core/**/*.js'];
gulp.task('client-playchaser-js', ['core-template-html'], function() {
  return gulp.src(clientCoreJsFiles, {base: 'client'})
  .pipe(ngAnnotate({add: true}))
  .pipe(concat('js/playchaser.min.js'))
  .pipe(uglify('js/playchaser.min.js'))
  .pipe(rev())
  .pipe(gulp.dest('static'))
  .pipe(rev.manifest({path: 'client-playchaser-js.manifest.json'}))
  .pipe(gulp.dest('bld'));
});

var allServerJsFiles = ['server/**/*.js'];
gulp.task('server-test', function() {
  return gulp.src(['server/**/*-test.js'], { read: false })
  .pipe(mocha());
});

// No client tests yet
gulp.task('client-test');

gulp.task('watch', function() {
  gulp.watch(allJavascriptSources, ['all-jscs', 'all-jshint']);
  gulp.watch(lessSourcesAll, ['client-less']);
  gulp.watch(clientFilesToCopy, ['client-copy']);
  gulp.watch([clientMainHtml, clientManifestFiles], ['client-html-watched']);
  gulp.watch(clientIndexJsFiles, ['client-index-js']);
  gulp.watch(clientLoginJsFiles, ['client-login-js']);
  gulp.watch(coreHtmlTemplates, ['client-playchaser-js']);
  gulp.watch(clientCoreJsFiles.concat('!client/js/core/_templates.js'),
    ['client-playchaser-js']);
  gulp.watch(allServerJsFiles, ['server-test']);
});

gulp.task('all-test', ['server-test', 'client-test']);
gulp.task('rev-all', ['client-less', 'client-js', 'client-copy']);
gulp.task('client-js', [
  'client-index-js',
  'client-login-js',
  'client-playchaser-js',
]);
gulp.task('client-all', [
  'client-less',
  'client-html-build',
  'client-js',
  'client-copy',
  'client-copy-lib',
]);
gulp.task('default', ['all-jscs', 'all-jshint', 'all-test', 'client-all']);


