let serveStatic = require('serve-static');
let rollup_commonjs = require('rollup-plugin-commonjs');
let rollup_babel = require('rollup-plugin-babel');
let rollup_uglify = require('rollup-plugin-uglify');

module.exports = function (grunt) {
  'use strict';
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {});
  grunt.loadNpmTasks('grunt-git');

  const baseOutDir = 'dist/';
  const bundleFolder = '/bundles/';
  const bundleExtension = '.umd.js';
  const moduleRoot = '/index.js';

  let pkg = grunt.file.readJSON('package.json');

  let buildModuleConfig = function (moduleDef) {
    let moduleName = moduleDef.module;
    let _result = {
      ts: {
        [moduleName]: {
          tsconfig: {
            tsconfig: moduleName,
            passThrough: true
          }
        }
      },
      tslint: {
        [moduleName]: {
          files: {
            src: [moduleName + "/**/*.ts"]
          }
        }
      },
      rollup: {
        [moduleName]: {
          options: {
            format: 'umd',
            moduleName: moduleName,
            sourceMap: true,
            globals: {
              '@angular/core': 'core',
              '@angular/common': 'common',
              '@angular/platform-browser': 'platformBrowser',
              '@angular/platform-browser-dynamic': 'platformBrowserDynamic',
              '@angular/router': 'router',
              'raphael': 'Raphael',
            },
            external: [
              '@angular/core',
              '@angular/common',
              '@angular/router',
              '@angular/platform-browser',
              '@angular/platform-browser-dynamic',
              '@angular/common',
              'rxjs/Observable',
              'rxjs/Subject',
              'rxjs/add/operator/toPromise',
              'raphael'
            ],
            plugins: function () {
              return [
                rollup_commonjs({
                  exclude: 'node_modules/**'
                }),
                rollup_babel({
                  exclude: 'node_modules/**'
                }),
                rollup_uglify({
                  exclude: 'node_modules/**'
                })
              ];
            }
          },
          files: {
            [baseOutDir + moduleName + bundleFolder + moduleName + bundleExtension]: baseOutDir + moduleName + moduleRoot
          }
        }
      },
      watch: {
        [moduleName + "-ts"]: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [moduleName + '/**/*.ts'],
          tasks: ['tslint', 'ts:' + moduleName, 'rollup:' + moduleName]
        },
        [moduleName + "-html"]: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [moduleName + '/**/*.html']
        },
        [moduleName + "-css"]: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [moduleName + "/**/*.css"]
        },
      }
    };

    moduleDef.localDependencies.forEach((dep) => {
      _result.rollup[moduleName].options.external.push(dep);
      _result.rollup[moduleName].options.globals[dep] = dep;
    });

    return _result;
  };

  let buildPublishConfig = function (moduleName, newVersion) {
    let packageTarball = moduleName + '-' + newVersion + '.tgz';
    grunt.config.set(moduleName + "-tarball", packageTarball);
    return {
      'string-replace': {
        [moduleName + "-package"]: {
          files: {
            [baseOutDir + moduleName + '/package.json']: moduleName + '/package.json'
          },
          options: {
            replacements: [
              {
                pattern: /0\.0\.0-PLACEHOLDER/gi,
                replacement: newVersion
              }
            ]
          }
        }
      },
      copy: {
        [moduleName]: {
          files: [{
            expand: true,
            dot: true,
            cwd: moduleName,
            dest: baseOutDir + moduleName,
            src: [
              'README.md',
              'LICENSE'
            ]
          }]
        }
      },
      exec: {
        [moduleName + "pack"]: {
          cmd: 'npm pack',
          cwd: baseOutDir + moduleName
        },
        [moduleName + "-publish-npm"]: {
          cmd: 'npm publish ' + packageTarball,
          cwd: baseOutDir + moduleName
        }
      },
      http: {
        ["create_release-" + moduleName]: {
          options: {
            uri: 'https://api.github.com/repos/synarque/' + moduleName + '/releases',
            method: 'POST',
            json: true,
            jar: true,
            headers: {
              'User-Agent': 'request',
              'Authorization': 'token <%= publish.githubtoken %>'
            },
            body: {
              tag_name: '<%= newVersion %>',
              target_commitish: '',
              name: moduleName + ' <%= newVersion %>',
              body: '[See full change log for details](../master/CHANGELOG.md)\n<%= tempChangeLog %>',
              draft: false,
              prerelease: false
            }
          }
        }
      }
    };
  };

  grunt.config.init({
    tslint: {
      options: {
        configuration: "tslint.json",
        force: false
      }
    },
    ts: {},
    rollup: {
      options: {}
    },
    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      default: {
        files: {
          src: ['Gruntfile.js']
        }
      }
    },
    connect: {
      options: {
        port: 9014,
        hostname: 'localhost',
        livereload: 39014
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              require('connect-livereload')(),
              serveStatic('demo_app'),
              serveStatic('dist/demo_app'),
              connect().use('/node_modules', serveStatic('./node_modules')),
              connect().use('/local_modules', serveStatic('./dist')),
              serveStatic('ng-worldmap')
            ];
          }
        }
      }
    },
    watch: {},
    clean: {
      default: {
        files: [{
          dot: true,
          src: [
            'dist'
          ]
        }]
      }
    },
    prompt: {
      confirm: {
        options: {
          questions: [
            {
              config: 'publish.confirmed',
              type: 'confirm',
              default: false,
              message: 'This action will stash any local changes, then potentially commit, tag and push the repository. Proceed?'
            }
          ]
        }
      },
      publish: {
        options: {
          questions: [
            {
              config: 'publish.type',
              type: 'list',
              message: 'What type of publish is this?',
              choices: [
                { name: "Patch (_._.x)", value: "patch" },
                { name: "Minor (_.x._)", value: "minor" },
                { name: "Major (x._._)", value: "major" }
              ],
              default: 'patch'
            },
            {
              config: 'publish.githubtoken',
              type: 'password',
              message: 'GitHub Personal Token ? (https://github.com/settings/tokens)'
            }
          ]
        }
      }
    },
    mkdir: {
      tmp: {
        options: {
          create: ['.tmp']
        }
      }
    },
    changelog: {
      dist: {
        options: {
          after: pkg.version,
          before: 'HEAD',
          insertType: 'prepend',
          featureRegex: /^(.+)$/gim,
          template: '## [<%= newVersion %>]\n{{> features}}',
          partials: {
            features: '{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}',
            feature: '- {{{this}}}\n'
          },
          dest: 'CHANGELOG.md'
        }
      },
      temp: {
        options: {
          after: pkg.version,
          before: 'HEAD',
          featureRegex: /^(.+)$/gim,
          template: '## [<%= newVersion %>]\n{{> features}}',
          partials: {
            features: '{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}',
            feature: '- {{{this}}}\n'
          },
          dest: '.tmp/changelog.txt'
        }
      }
    },
    version: {
      dist: {
        src: ['package.json']
      }
    },
    gitstash: {
      dist: {
        options: {
          command: "save",
        }
      }
    },
    gitadd: {
      dist: {
        files: {
          src: ['package.json', 'CHANGELOG.md']
        }
      }
    },
    gitcommit: {
      dist: {
        options: {
          message: 'Release commit for version <%= newVersion %>. See change log for more details'
        }
      }
    },
    gittag: {
      dist: {
        options: {
          tag: '<%= newVersion %>',
          message: '<%= tempChangeLog %>',
          annotated: true
        }
      }
    },
    gitpush: {
      dist: {
        options: {
          branch: 'HEAD',
          tags: true
        }
      }
    }
  });

  grunt.registerTask('checkConfirm', function () {
    if (grunt.config.get('publish.confirmed') !== true) {
      grunt.log.write("Interrupted by user.");
      grunt.task.clearQueue();
    }
  });

  grunt.task.registerTask('fetchTempLog', '', function () {
    grunt.config.set('tempChangeLog', grunt.file.read('.tmp/changelog.txt'));
  });

  let modulesList = [
    { module: "ng-worldmap", published: true, localDependencies: [] },
    { module: "demo_app", published: false, localDependencies: ['ng-worldmap'] }
  ];

  modulesList.forEach((moduleDef) => {
    grunt.config.merge(buildModuleConfig(moduleDef));
  });

  grunt.registerTask('build', [
    'jshint',
    'tslint',
    'clean',
    'ts',
    'rollup'
  ]);

  grunt.registerTask('serve', [
    'build',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('publish', [
    'prompt:confirm',
    'checkConfirm',
    'prompt:publish',
    'handlePublishResult'
  ]);

  grunt.registerTask('handlePublishResult', function () {
    grunt.task.run([
      'gitstash',
      'version::' + grunt.config.get('publish.type'),
      'postVersionIncrement',
      'build',
      'string-replace',
      'copy',
      'changelog',
      'fetchTempLog',
      'gitadd',
      'gitcommit',
      'exec',
      'gittag',
      'gitpush',
      'delay',
      'http'
    ]);
  });

  grunt.registerTask('postVersionIncrement', function () {
    let _newVersion = grunt.file.readJSON('package.json').version;
    grunt.config.set('newVersion', _newVersion);
    modulesList.forEach((moduleDef) => {
      if (moduleDef.published) {
        grunt.config.merge(buildPublishConfig(moduleDef.module, _newVersion));
      }
    });
  });

  grunt.registerTask('delay', function () {
    var done = this.async();
    setTimeout(function () { done(); }, 1000);
  });
};
