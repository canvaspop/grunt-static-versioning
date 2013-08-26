/*
 * grunt-versioning
 * http://github.com/canvaspop/grunt-versioning
 *
 * Copyright (c) 2013 CanvasPop
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function ( grunt ) {

    // Project configuration.
    grunt.initConfig({

        cssmin: {
            dist: {
                options: {
                    banner: '/*! banner */',
                    report: 'gzip'
                },
                files: [{
                    src: [ 'test/src/css/main.css' ],
                    dest: 'tmp/css/main.min.css',
                    versioningParent: 'global'
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
            dist: {
                options: {
                    mangle: true,
                    wrap: true
                },
                files: [{
                    src: [
                        'test/src/js/file1.js',
                        'test/src/js/file2.js',
                        'test/components/test/test.js'
                    ],
                    dest: 'tmp/js/main.min.js',
                    versioningParent: 'global'
                }, {
                    src: [
                        'test/src/js/file3.js',
                        'test/src/js/file4.js'
                    ],
                    dest: 'tmp/js/plugin.min.js',
                    versioningParent: 'global'
                }, {
                    src: [
                        'test/src/js/file1.js',
                        'test/src/js/file2.js',
                        'test/src/js/file3.js',
                        'test/src/js/file4.js'
                    ],
                    dest: 'tmp/js/all.min.js',
                    versioningParent: 'all'
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
                    assets: '<%= uglify.dist.files %>',
                    dest: 'js',
                    type: 'js',
                    ext: '.min.js'
                }, {
                    assets: '<%= cssmin.dist.files %>',
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
                    assets: '<%= uglify.dist.files %>',
                    dest: 'js',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= cssmin.dist.files %>',
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
                    assets: '<%= uglify.dist.files %>',
                    dest: '',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= cssmin.dist.files %>',
                    dest: '',
                    type: 'css',
                    ext: '.css'
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
                    assets: '<%= uglify.dist.files %>',
                    dest: '',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= cssmin.dist.files %>',
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
                    assets: '<%= uglify.dist.files %>',
                    dest: 'static',
                    type: 'js',
                    ext: '.js'
                }, {
                    assets: '<%= cssmin.dist.files %>',
                    dest: 'static',
                    type: 'css',
                    ext: '.css'
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
