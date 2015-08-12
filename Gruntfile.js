module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
          files: ['bower_components/*'],
          tasks: ['wiredep']
        },

        wiredep: {
              task: {
                src: ['dev/*.html']
              }
        },

        clean: ["prod", '.tmp'],
 
        copy: {
            main: {
                expand: true,
                cwd: 'dev/',
                src: ['**', '!js/**', '!lib/**', '!**/*.css'],
                dest: 'prod/'
            },
            shims: {
                expand: true,
                cwd: 'dev/js',
                src: ['**'],
                dest: 'prod/js/shims'
            }
        },
 
        rev: {
            files: {
                src: ['prod/**/*.{js,css}', '!prod/js/shims/**']
            }
        },
 
        useminPrepare: {
            html: 'dev/index.html'
        },
 
        usemin: {
            html: ['prod/index.html']
        },
 
        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        }
        
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [ 'wiredep' ]);
    grunt.registerTask('changes', ['watch']);
    grunt.registerTask('build', [
        'wiredep', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin'
    ]);


};