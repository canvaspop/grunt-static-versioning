/*
 * grunt-static-versioning
 * http://www.github.com/canvaspop/grunt-static-versioning
 *
 * Copyright (c) 2013 CanvasPop
 * Licensed under the MIT license.
 */

'use strict';

// lib to create hash
var crypto = require( 'crypto' );
var util = require( 'util' );

/**
 * Helper method to log objects
 *
 * @param  {Object} obj Object to log
 * @return {String}
 */
function inspect ( obj ) {
    return util.inspect( obj, false, 4, true );
}

module.exports = function ( grunt ) {

    grunt.registerMultiTask( 'versioning', 'Create md5 hash based on static assets content and append to file name', function () {
        var versioning = {};
        var options = this.options() || {};
        var supported = /(php|json)/i;
        var target = this.target || '';
        var cwd = options.cwd || '';
        var env = options.env || 'prod';
        var output = options.output || 'json';
        var outputDir = options.outputConfigDir || cwd;
        var namespace = options.namespace || 'staticAssets';

        if ( cwd !== '' ) {
            cwd += '/';
        }

        if ( target !== '' ) {
            target = ':' + target;
        }

        this.files.forEach( function ( file ) {

            if (file.orig.expand)
            {
                file.assets = [];
  
                file.src.forEach(function(filesrc) {
                    file.assets.push({dest: filesrc, src: file.orig.cwd + '/' + file.dest});
                    file.ext = file.orig.ext;
                    file.dest = file.orig.dest;
                    file.type = file.orig.type;
                });

            }
             
            if ( !( file.assets instanceof Array ) ) {
                grunt.fail.warn( 'Invalid argument : `assets` property must be set' );
            }

            file.assets.forEach( function ( asset ) {
                var parent = file.key;
                var fileDest = file.dest === '' ? '' : ( file.dest + '/' );

                if ( !parent ) {
                    grunt.fail.warn( 'Invalid argument : `key` property must be set' );
                }

                // store information to be able to retrieve later
                versioning[ parent ] = versioning[ parent ] || {};
                versioning[ parent ][ file.type ] = versioning[ parent ][ file.type ] || [];

                // production: copy minified files over
                // development: copy src files over
                if ( env === 'prod' ) {
                    var hash = ( !file.bypass ) ? '.' + crypto.createHash( 'md5' ).update( grunt.file.read( asset.dest, 'utf8' ) ).digest( 'hex' ).substring( 0, 8 ) : '';
                    var sep = asset.dest.split( '/' );
                    var name = sep[ sep.length - 1 ].replace( /(.min)?.(js|css)/, '' );
                    var dest = fileDest + name + hash + file.ext;
                    var content = grunt.file.read( asset.dest );

                    // push minified file only to versioning object
                    versioning[ parent ][ file.type ].push( '/' + dest );
                    // write file to out directory and log it
                    // this allows future content manipulation (e.g. sourcemaps)
                    // rather than simply copying the file over
                    grunt.file.write( cwd + '' + dest, content );
                    grunt.log.ok( 'File "' + cwd + '' + dest + '" created.' );
                } else {
                    asset.src.forEach( function ( src ) {
                        var aFilename = src.split( '/' );
                        var filename = aFilename[ aFilename.length - 1 ];

                        // push source files only to versioning object
                        versioning[ parent ][ file.type ].push( '/' + fileDest + filename );
                        // copy file to out directory and log it
                        grunt.file.copy( src, cwd + fileDest + filename );
                        grunt.log.ok( 'File "' + cwd + fileDest + filename + '" created.' );
                    });
                }

                // ensure js and css exists even if empty
                if ( !versioning[ parent ].css ) {
                    versioning[ parent ].css = [];
                }
                if ( !versioning[ parent ].js ) {
                    versioning[ parent ].js = [];
                }
            });
        });

        // store info in config object for future use and log it
        grunt.config.set( 'versioningConfig' + target, versioning );
        grunt.log
            .subhead( 'grunt.config.get( \'versioningConfig' + target + '\' ) returns:' )
            .writeln( inspect( versioning ) );

        // if attempt to output to an unsupported format
        if ( !supported.test( output ) ) {
            grunt.fail.warn( 'Invalid argument : \'' + output + '\' output is not currently supported' );
        }

        switch ( output ) {
        case 'json':
            versioningJSON( versioning, outputDir, namespace );
            break;
        case 'php':
            versioningPHP( versioning, outputDir, namespace );
            break;
        }
    });

    /**
     * Generate a JSON config file
     *
     * @todo   Determine if keeping these in this file is the right approach
     *
     * @param  {Object} obj  Versioning object created by the task
     * @param  {String} dest Location to save the generated config file
     * @param  {String} ns   Namespace to wrap config content
     * @return {undefined}
     */
    function versioningJSON ( obj, dest, ns ) {
        var content = {};
        content[ ns ] = obj;
        var json = JSON.stringify( content, null, 2 );
        grunt.log.subhead( 'Generating JSON config file' );
        grunt.file.write( dest + '/assets.config.json', json );
        grunt.log.ok( 'File "' + dest + '/assets.config.json" created.' );
    }

    /**
     * Generate a PHP config file
     *
     * @todo   Determine if keeping these in this file is the right approach
     *
     * @param  {Object} obj  Versioning object created by the task
     * @param  {String} dest Location to save the generated config file
     * @param  {String} ns   Namespace to wrap config content
     * @return {undefined}
     */
    function versioningPHP ( obj, dest, ns ) {
        var contents = '<?php\n';
        contents += 'return array(\n';
        contents += '    \'' + ns + '\' => array(\n';
        for ( var key in obj ) {
            if ( obj.hasOwnProperty( key ) ) {
                contents += '        \'' + key + '\' => array(\n';
                contents += '            \'css\' => array(\n';
                contents += extractFiles( obj[ key ].css , 'php');
                contents += '            ),\n';
                contents += '            \'js\' => array(\n';
                contents += extractFiles( obj[ key ].js , 'php');
                contents += '            ),\n';
                contents += '        ),\n';
            }
        }
        contents += '    )\n';
        contents += ');\n';

        grunt.log.subhead( 'Generating PHP config file' );
        grunt.file.write( dest + '/assets.config.php', contents );
        grunt.log.ok( 'File "' + dest + '/assets.config.php" created.' );
    }

    /**
     * Extract file paths from an array
     *
     * @todo   Determine if keeping these in this file is the right approach
     *
     * @param  {Array} arr Array of paths
     * @return {String}
     */
    function extractFiles ( arr , type) {
        var contents = '';
        arr.forEach( function ( file ) {
            // space is for formatting on the output
            if (type == 'php')
                contents += '                 \'' + file.replace(/(.+)\/(.+)\.(.+)\.(.+)/,'$2') + '\'=>\'' + file + '\',\n';
            else contents += '                \'' + file + '\',\n';
        });
        return contents;
    }
};
