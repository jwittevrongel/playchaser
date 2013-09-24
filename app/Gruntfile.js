"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // concat: {
//       options: {
//         separator: ';'
//       },
//       dist: {
//         src: ['src/**/*.js'],
//         dest: 'dist/<%= pkg.name %>.js'
//       }
//     },
//     uglify: {
//       options: {
//         banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
//       },
//       dist: {
//         files: {
//           'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
//         }
//       }
//     },
    jshint: {
      server: {
        src: ['Gruntfile.js', 'app.js', 'lib/**/*.js', 'db/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'views/**/*.js', 'bin/*'],
        options: {
          node: true
        }
      },
      client: {
        src: ['public/js/**/*.js'],
        options: {
          browser: true,
          jquery: true,
          globalstrict: true,
          globals: {
            angular: false
          }
        }
      }
    },

    less: {
      dev: {
        files: [{
          expand: true,
          cwd: 'public/css/',
          src: ['login.less'],
          dest: 'public/css/',
          ext: '.css'
        }]
      },
      dist: {
        files: '<%= less.dev.files %>',
        options: {
          compress: true,
          optimization: 2
        }
      }
    },

    copy: {
      client: {
        files: [{
           expand: true,
           cwd: 'public/',
           src: ['**/*.html', 'lib/**/*.js', '**/*.css', 'js/**/*.js'],
           dest: 'client/'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'less:dev', 'copy:client']);
  grunt.registerTask('dist', ['jshint', 'concat:client', 'uglify:client', 'less:dist', 'copy:client', ]);
};