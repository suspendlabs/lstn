module.exports = (grunt) ->
  grunt.initConfig
    lstn:
      static: 'lstn/static'
      dist: 'dist'

    clean:
      dist:
        files: [
          {
            dot: true
            src: [
              '.tmp'
              '<%= lstn.dist %>/**/*'
            ]
          }
        ]
      lstn: '.tmp'

    copy:
      dist:
        files: [
          {
            expand: true
            cwd: '<%= lstn.static %>'
            dest: '<%= lstn.dist %>'
            src: '*.{png,xml,ico,json,txt}'
          }
          {
            expand: true
            cwd: '<%= lstn.static %>/css'
            dest: '<%= lstn.dist %>/css'
            src: '**/*.css'
          }
          {
            expand: true
            cwd: '<%= lstn.static %>/js'
            dest: '<%= lstn.dist %>/js'
            src: '**/*.js'
          }
          {
            expand: true
            cwd: '<%= lstn.static %>/images'
            dest: '<%= lstn.dist %>/images'
            src: '**/*'
          }
          {
            expand: true
            cwd: '<%= lstn.static %>/bower_components'
            dest: '<%= lstn.dist %>/bower_components'
            src: '**/*'
          }
        ]

    ngconstant:
      options:
        space: '  '
        wrap: '/* jshint ignore:start */\n\n"use strict";\n\n {%= __ngModule %}',
        name: 'lstn.config'
      lstn:
        options:
          dest: '<%= lstn.static %>/js/config.js'
        constants: 'config/development.json'
      dist:
        options:
          dest: '<%= lstn.static %>/js/config.js'
        constants: 'config/production.json'

    ngtemplates:
      options:
        standalone: true,
        module: 'lstn.templates',
        prefix: '/',
        url: (path) ->
          return path.substring('/lstn'.length);
      dist:
        src: '<%= lstn.static %>/partials/**/*.html'
        dest: '<%= lstn.dist %>/js/templates.js'
      lstn:
        src: '<%= lstn.static %>/partials/**/*.html'
        dest: '<%= lstn.static %>/js/templates.js'

    jshint:
      options:
        jshintrc: '.jshintrc'
        reporter: require('jshint-stylish')
      all:
        src: ['<%= lstn.static %>/js/**/*.js']

    jsbeautifier:
      files: ['<%= lstn.static %>/js/**/*.js']
      options:
        indent_size: 2

    compass:
      options:
        sassDir: '<%= lstn.static %>/sass'
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
        noLineComments: true
      dist:
        options:
          cssDir: '<%= lstn.dist %>/css'
          imagesDir: '<%= lstn.dist %>/images'
          javascriptsDir: '<%= lstn.dist %>/js'
          importPath: '<%= lstn.dist %>/bower_components',
          generatedImagesDir: '<%= lstn.dist %>/images/generated'

      lstn:
        options:
          cssDir: '<%= lstn.static %>/css'
          imagesDir: '<%= lstn.static %>/images'
          javascriptsDir: '<%= lstn.static %>/js'
          importPath: '<%= lstn.static %>/bower_components',
          generatedImagesDir: '<%= lstn.static %>/images/generated'

    watch:
      bower:
        files: ['bower.json']
        tasks: ['wiredep:lstn']
      js:
        files: ['<%= lstn.static %>/js/**/*.js']
        tasks: ['jshint']
      ngtemplates:
        files: ['<%= lstn.static %>/partials/**/*.html']
        tasks: ['ngtemplates:lstn']
      sass:
        files: ['<%= lstn.static %>/sass/**/*.scss']
        tasks: ['compass:lstn']

    wiredep:
      lstn:
        src: ['lstn/templates/layout.html']
        ignorePath: '../static/'

    useminPrepare:
      html: 'lstn/templates/layout.html'
      options:
        root: '<%= lstn.dist %>'
        dest: '<%= lstn.dist %>'

    usemin:
      html: 'lstn/templates/layout.html'
      options:
        assetsDirs: [
          '<%= lstn.dist %>'
        ]

    filerev:
      dist:
        files: [
          {
            src: ['<%= lstn.dist %>/js/**/*.js']
            dest: '<%= lstn.dist %>/js'
          }
          {
            src: ['<%= lstn.dist %>/css/**/*.css']
            dest: '<%= lstn.dist %>/css'
          }
        ]

    htmlmin:
      dist:
        files: 
          'lstn/templates/layout.html': 'lstn/templates/layout.html'
        options:
          collapseWhitespace: true
          conservativeCollapse: true
          collapseBooleanAttributes: true
          removeCommentsFromCDATA: true
          removeOptionalTags: true
          removeComments: true

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
  grunt.loadNpmTasks 'grunt-filerev'
  
  grunt.registerTask 'default', [
    'wiredep'
    'ngconstant:lstn'
    'jshint'
    'compass:lstn'
    'ngtemplates:lstn'
  ]

  grunt.registerTask 'build', [
    'clean:dist'
    'copy'
    'ngtemplates:dist'
    'useminPrepare'
    'concat:generated'
    'cssmin:generated'
    'uglify:generated'
    'filerev'
    'usemin'
    'htmlmin'
  ]

  grunt.registerTask 'deploy', ['ngconstant:dist', 'build']
