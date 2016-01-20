'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist/'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    ingresse: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= ingresse.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= ingresse.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= ingresse.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= ingresse.app %>/styles/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 443,
        protocol: 'https',
        hostname: '0.0.0.0',
        livereload: 357230
      },
      livereload: {
        options: {
          open: false,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static(appConfig.dist)
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= ingresse.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= ingresse.dist %>/{,*/}*',
            '!<%= ingresse.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= ingresse.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= ingresse.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= ingresse.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/styles/generated',
        imagesDir: '<%= ingresse.app %>/styles',
        javascriptsDir: '<%= ingresse.app %>/scripts',
        fontsDir: '<%= ingresse.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/styles',
        httpGeneratedImagesPath: '/styles/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= ingresse.dist %>/v7/styles/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= ingresse.dist %>/v7/scripts/{,*/}*.js',
          '<%= ingresse.dist %>/v7/styles/{,*/}*.css',
          // '<%= ingresse.dist %>/styles/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= ingresse.dist %>/v7/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= ingresse.dist %>/v7/',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= ingresse.dist %>/v7//{,*/}*.html'],
      css: ['<%= ingresse.dist %>/v7/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= ingresse.dist %>/v7/','<%= ingresse.dist %>/v7/styles']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= ingresse.app %>/styles',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= ingresse.dist %>/v7/styles'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= ingresse.app %>/styles',
          src: '{,*/}*.svg',
          dest: '<%= ingresse.dist %>/v7/styles'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= ingresse.dist %>/v7/',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= ingresse.dist %>/v7/'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= ingresse.dist %>/v7/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      redirect: {
        files: [{
          expand: true,
          dot: true,
          cwd: './',
          dest: '<%= ingresse.dist %>',
          src: [
            'index.html',
            'parse-response.html'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= ingresse.app %>',
          dest: '<%= ingresse.dist %>/v7/',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'styles/**/*.{webp,svg,gif}',
            'styles/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/styles',
          dest: '<%= ingresse.dist %>/v7/styles',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= ingresse.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Check for script to use in dev or prod
    targethtml: {
      prod: {
        files: {
          '.tmp/index.html': '<%= ingresse.app %>/index.html',
        }
      },
      dev: {
        files: {
          '.tmp/index.html': '<%= ingresse.app %>/index.html',
        }
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'jshint:all',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'targethtml:prod',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:redirect',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin'
  ]);

  grunt.registerTask('build:dev', [
    'clean:dist',
    'wiredep',
    'targethtml:dev',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:redirect',
    'copy:dist',
    'cssmin',
    'uglify',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};

