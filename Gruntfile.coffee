module.exports = (grunt) ->
  jsFiles = ['lstn/static/js/**/*.js']
  cssFiles = ['lstn/static/css/**/*.css']

  grunt.initConfig
    concat:
      lstn:
        files:
          'lstn/static/js/lstn.js': jsFiles
          'lstn/static/css/lstn.css': cssFiles
    jshint:
      files: jsFiles
      options:
        globalstrict: true
        '-W117': true
        browser: true
        devel: true
        jquery: true
    jsbeautifier:
      files: jsFiles
      options:
        indent_size: 2
    compass:
      lstn:
        options:
          sassDir: 'sass'
          cssDir: 'lstn/static/css'
          noLineComments: true
          force: true
    watch:
      sass:
        files: ['lstn/sass/**/*.scss']
        tasks: ['compass']
    uglify:
      lstn:
        options:
          sourceMap: true
        files: [
          expand: true
          cwd: 'lstn/static/js'
          src: ['**/*.js', '!**/*.min.js', '!**/*.src.js']
          dest: 'lstn/static/js'
        ]
    cssmin:
      lstn:
        expand: true
        cwd: 'lstn/static/css'
        src: '**/*.css'
        dest: 'lstn/static/css'

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-jsbeautifier'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  
  grunt.registerTask 'default', ['jshint', 'compass']
  grunt.registerTask 'precommit', ['jshint', 'compass']
  grunt.registerTask 'deploy', ['concat', 'uglify', 'cssmin']
