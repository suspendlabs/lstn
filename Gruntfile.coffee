module.exports = (grunt) ->
  jsFiles = ['lstn/static/js/**/*.js']
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

    wiredep:
      lstn:
        files: ['lstn/templates/index.html']
        ignorePath: '..'

    useminPrepare:
      html: 'lstn/templates/index.html'
      options:
        dest: 'lstn'

    usemin:
      html: 'lstn/templates/index.html'

    copy:
      dist:
        files: [
          { cwd: 'lstn/static/bower_components/bootstrap/fonts/', src:['**'], dest: 'lstn/static/dist/fonts', expand: true},
          { cwd: 'lstn/static/bower_components/fontawesome/fonts/', src:['**'], dest: 'lstn/static/dist/fonts', expand: true}
        ]

    htmlmin:
      dist:
        files: 
          'lstn/templates/index.html': 'lstn/templates/index.html'
        options:
          removeComments: true,
          collapseWhitespace: true
      

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-jsbeautifier'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-angular-templates'
  grunt.loadNpmTasks 'grunt-ng-constant'
  grunt.loadNpmTasks 'grunt-wiredep'
  grunt.loadNpmTasks 'grunt-usemin'
  
  grunt.registerTask 'default', ['wiredep', 'ngconstant:development', 'jshint', 'compass', 'ngtemplates']
  grunt.registerTask 'build', [
    'copy:dist',
    'useminPrepare', 
    'concat:generated', 
    'cssmin:generated', 
    'uglify:generated', 
    'usemin',
    'htmlmin:dist'
  ]
  grunt.registerTask 'deploy', ['ngconstant:production', 'build']
