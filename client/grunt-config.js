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
		}
	},
	npmPlugins: ['grunt-contrib-sass'],
	tasks: ['sass']
};