/*
 * grunt-static-versioning
 * http://github.com/canvaspop/grunt-static-versioning
 *
 * Copyright (c) 2013 CanvasPop
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function ( grunt ) {

    // Project configuration.
    grunt.initConfig({

        cssmin: {
            options: {
                banner: '/*! banner */',
                report: 'gzip'
            },
            main: {
                files: [{
                    src: [ 'test/src/css/main.css' ],
                    dest: 'tmp/css/main.min.css'
                }]
            }
        },

        clean: {
            pre: [ 'tmp', 'public', 'public2', 'public3', 'public4' ],
            post: [ 'tmp' ]
        },

        jshint: {
            files: {
                src: [
                    'Gruntfile.js',
                    'tasks/*.js',
                    '<%= nodeunit.tests %>'
                ]
            },
            options: {
                jshintrc: '.jshintrc'
            }
        },

        nodeunit: {
            tests: [ 'test/*_test.js' ]
        },

        uglify: {
            options: {
                mangle: true,
                wrap: false
            },
            main: {
                files: [{
                    src: [
                        'test/src/js/file1.js',
                        'test/src/js/file2.js',
                        'test/components/test/test.js'
                    ],
                    dest: 'tmp/js/main.min.js'
                }]
            },
            skip: {
                files: [{
                    src: [
                        'test/src/js/file1.js',
                        'test/src/js/file2.js'
                    ],
                    dest: 'tmp/js/skip.min.js'
                }]
            },
            plugin: {
                files: [{
                    src: [
                        'test/src/js/file3.js',
                        'test/src/js/file4.js'
                    ],
                    dest: 'tmp/js/plugin.min.js'
                }]
            },
            all: {
                files: [{
                    src: [
                        'test/src/js/file1.js',
                        'test/src/js/file2.js',
                        'test/src/js/file3.js',
                        'test/src/js/file4.js'
                    ],
                    dest: 'tmp/js/all.min.js'
                }]
            }
        },

        versioning: {
            options: {
                cwd: 'public'
            },
            dist: {
                options: {
                    outputConfigDir: 'public/config'
                },
                files: [{
                    assets: '<%= uglify.main.files %>',
                    key: 'global',
                    dest: 'js',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.plugin.files %>',
                    key: 'global',
                    dest: 'js',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.all.files %>',
                    key: 'all',
                    dest: 'js',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.skip.files %>',
                    key: 'skip',
                    bypass: true,
                    dest: 'js',
                    type: 'js',
                    ext: '.min.js'
                },

                {
                    assets: '<%= cssmin.main.files %>',
                    key: 'global',
                    dest: 'css',
                    type: 'css',
                    ext: '.min.css'
                }]
            },
            dist2: {
                options: {
                    cwd: 'public2',
                    output: 'php',
                    outputConfigDir: 'public2/config',
                    namespace: 'static.assets'
                },
                files: [{
                    assets: '<%= uglify.main.files %>',
                    key: 'global',
                    dest: 'js',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= uglify.plugin.files %>',
                    key: 'global',
                    dest: 'js',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= uglify.all.files %>',
                    key: 'all',
                    dest: 'js',
                    type: 'js',
                    ext: '.js'
                },

                {
                    assets: '<%= cssmin.main.files %>',
                    key: 'global',
                    dest: 'css',
                    type: 'css',
                    ext: '.css'
                }]
            },
            dist3: {
                options: {
                    env: 'dev',
                    output: 'php',
                    outputConfigDir: 'public/config',
                    namespace: 'static.assets'
                },
                files: [{
                    assets: '<%= uglify.main.files %>',
                    key: 'global',
                    dest: '',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.plugin.files %>',
                    key: 'global',
                    dest: '',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.all.files %>',
                    key: 'all',
                    dest: '',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.skip.files %>',
                    key: 'skip',
                    bypass: true,
                    dest: '',
                    type: 'js',
                    ext: '.min.js'
                },

                {
                    assets: '<%= cssmin.main.files %>',
                    key: 'global',
                    dest: '',
                    type: 'css',
                    ext: '.min.css'
                }]
            },
            prod: {
                options: {
                    cwd: 'public4',
                    env: 'prod',
                    output: 'json',
                    outputConfigDir: 'public4/config'
                },
                files: [{
                    assets: '<%= uglify.main.files %>',
                    key: 'global',
                    dest: '',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= uglify.plugin.files %>',
                    key: 'global',
                    dest: '',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= uglify.all.files %>',
                    key: 'all',
                    dest: '',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= uglify.skip.files %>',
                    key: 'global',
                    bypass: true,
                    dest: '',
                    type: 'js',
                    ext: '.js'
                },

                {
                    assets: '<%= cssmin.main.files %>',
                    key: 'global',
                    dest: '',
                    type: 'css',
                    ext: '.css'
                }]
            },
            dev: {
                options: {
                    cwd: 'public3',
                    env: 'dev',
                    output: 'json',
                    outputConfigDir: 'public3/config'
                },
                files: [{
                    assets: '<%= uglify.main.files %>',
                    key: 'global',
                    dest: 'static',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.plugin.files %>',
                    key: 'global',
                    dest: 'static',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= uglify.all.files %>',
                    key: 'all',
                    dest: 'static',
                    type: 'js',
                    ext: '.min.js'
                },

                {
                    assets: '<%= cssmin.main.files %>',
                    key: 'global',
                    dest: 'static',
                    type: 'css',
                    ext: '.min.css'
                }]
            }
        }
    });

    // Actually load this plugin's task(s)
    grunt.loadTasks( 'tasks' );

    // These plugins provide necessary tasks
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask( 'test', [ 'clean:pre', 'uglify', 'cssmin', 'versioning', 'clean:post', 'nodeunit' ] );
    grunt.registerTask( 'default', [ 'jshint', 'test' ] );
};
