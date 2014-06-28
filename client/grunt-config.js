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
			}
		},
		npmPlugins: ['grunt-contrib-less', 'grunt-contrib-jshint'],
		tasks: ['jshint:client', 'less:client']
	};
})(module);