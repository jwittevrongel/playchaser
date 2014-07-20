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
						dest: 'static'
					},
					files: {
						src: ['client/**/*.html']
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
					}]
				}
			}
			
		},
		npmPlugins: [
			'grunt-contrib-less', 'grunt-contrib-jshint', 'grunt-usemin', 
			'grunt-contrib-concat', 'grunt-contrib-cssmin', 'grunt-contrib-uglify', 
			'grunt-contrib-htmlmin'
		],
		tasks: [
			'jshint:client', 'less:client', 'useminPrepare:client', 'concat:generated', 
			'cssmin:generated', 'uglify:generated', 'usemin:client', 'htmlmin:client'
		]
	};
})(module);