module.exports = (grunt) ->
  jsFiles = ['lstn/static/js/**/*.js']
  cssFiles = ['lstn/static/css/**/*.css']

  grunt.initConfig
    ngconstant:
      options:
        space: '  '
        wrap: '/* jshint ignore:start */\n\n"use strict";\n\n {%= __ngModule %}',
        name: 'lstn.config'
      development:
        options:
          dest: 'lstn/static/js/config.js'
        constants: 'config/development.json'
      production:
        options:
          dest: 'lstn/static/js/config.js'
        constants: 'config/production.json'
    ngtemplates:
      lstn:
        src: 'lstn/static/partials/**/*.html'
        dest: 'lstn/static/js/templates.js'
        options:
          standalone: true,
          module: 'lstn.templates',
          prefix: '/',
          url: (path) ->
            return path.substring('/lstn'.length);
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
      ngtemplates:
        files: ['lstn/static/partials/**/*.html']
        tasks: ['ngtemplates']
      sass:
        files: ['sass/**/*.scss']
        tasks: ['compass']

    useminPrepare:
      html: 'lstn/templates/index.html'

    usemin:
      html: 'lstn/templates/index.html'
      
    wiredep:
      lstn:
        src: ['lstn/templates/index.html']
        ignorePath: '..'
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
  grunt.loadNpmTasks 'grunt-angular-templates'
  grunt.loadNpmTasks 'grunt-ng-constant'
  grunt.loadNpmTasks 'grunt-wiredep'
  grunt.loadNpmTasks 'grunt-usemin'
  

  grunt.registerTask 'build', ['useminPrepare', 'concat:generated', 'uglify:generated', 'usemin']
  grunt.registerTask 'default', ['wiredep', 'ngconstant:development', 'jshint', 'compass', 'ngtemplates']
  grunt.registerTask 'precommit', ['jshint', 'compass', 'ngtemplates']
  grunt.registerTask 'deploy', ['ngconstant:production', 'concat', 'uglify', 'cssmin']
