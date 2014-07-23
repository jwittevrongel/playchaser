/* global module */
(function(module) {
	"use strict";

	module.exports = {
		config: {
			less: {
				client: {
					files: [{
						expand: true,
						cwd: 'client/css',
						src: ['*.less', '!_*.less'],
						dest: 'client/css',
						ext: '.css'
					}]
				}
			},
		
			jshint: {
				client: {
					options: {
						jshintrc: true
					},
					src: ['client/**/*.js', '!client/lib/**/*']
				}
			},
			
			useminPrepare: {
				client: {
					src: ['client/**/*.html'],
					options: {
						dest: 'static'
					}
				}
			},
			
			usemin: {
				client: {
					options: {
						type: 'html',
						assetsDirs: ['static'],
						blockReplacements: {
      						replace: function (block) {
          						return '<script src="' + block.dest + '"></script>';
          					}
      					}
					},
					files: {
						src: ['static/**/*.html']
					}
				}
			},
			
			htmlmin: {
				client: {
					files: [{
						expand: true,
						cwd: 'static',
						src: ['**/*.html'],
						dest: 'static'
					}],
					options: {
						removeComments: true,
						collapseWhitespace: true,
						collapseBooleanAttributes: true,
						removeAttributeQuotes: true,
						removeRedundantAttributes: true,
						removeEmptyAttributes: true
					}
				}
			},
			
			copy: {
				client: {
					files: [{
						expand: true, 
						cwd: 'client', 
						src: ['**/*.html'],
						dest: 'static/'
					}, {
						expand: true, 
						cwd: 'client/lib', 
						src: ['**'],
						dest: 'static/lib'
					}, {
						expand: true, 
						cwd: 'client/img', 
						src: ['**'],
						dest: 'static/img'
					}]
				}
			}
		},
		npmPlugins: [
			'grunt-contrib-less', 'grunt-contrib-jshint', 'grunt-usemin', 
			'grunt-contrib-concat', 'grunt-contrib-cssmin', 'grunt-contrib-uglify', 
			'grunt-contrib-htmlmin', 'grunt-contrib-copy'
		],
		tasks: [
			'jshint:client', 'less:client', 'useminPrepare:client', 'concat:generated', 
			'cssmin:generated', 'uglify:generated', 'copy:client', 'usemin:client', 
			'htmlmin:client'
		]
	};
})(module);