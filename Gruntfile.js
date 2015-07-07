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

        githooks: {
            all: {
              
              // Will bind the bower:install task 
              // with a specific template 
              'post-merge': {
                taskNames: 'bower:install'
              }
            }
        }
        
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-githooks');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [ 'wiredep' , 'githooks']);
    grunt.registerTask('changes', ['watch']);


};