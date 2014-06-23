/* global module */
(function(module) {
	"use strict";

	module.exports = {
		config: {
			sass: {
				client: {
					options: {
						precision: 10
					},
					files: [{
						expand: true,
						cwd: 'client/css',
						src: ['*.scss'],
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
			}
		},
		npmPlugins: ['grunt-contrib-sass', 'grunt-contrib-jshint'],
		tasks: ['jshint', 'sass']
	};
})(module);