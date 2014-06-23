"use strict";

module.exports = {
	config: {
		jshint: {
			server: {
				options: {
					jshintrc: true
				},
				src: ['server/**/*.js']
			}
		}
	},
	npmPlugins: ['grunt-contrib-jshint'],
	tasks: ['jshint:server']
};