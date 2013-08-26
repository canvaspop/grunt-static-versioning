'use strict';

var grunt = require( 'grunt' ),
    fixtures = 'test/fixtures/expected';

exports.versioning = {
    dist: function ( test ) {
        test.expect( 3 );

        var main, plug, style;

        try {
            main = grunt.file.read( 'public/js/main.c2e864c8.min.js' );
        } catch ( e ) {}
        try {
            plug = grunt.file.read( 'public/js/plugin.24d54461.min.js' );
        } catch ( e ) {}
        try {
            style = grunt.file.read( 'public/css/main.b6f17edb.min.css' );
        } catch ( e ) {}

        test.ok( main, 'should have created main js file with hash' );
        test.ok( plug, 'should have created plugin js file with hash' );
        test.ok( style, 'should have created main css file with hash' );

        test.done();
    },
    dist2: function ( test ) {
        test.expect( 4 );

        var main, plug, style,
            task = grunt.config( 'versioning' ).dist2,
            actual = grunt.file.read( task.options.outputConfigDir + '/assets.config.php' ),
            expected = grunt.file.read( fixtures + '/assets.config.prod.php' );

        try {
            main = grunt.file.read( 'public2/js/main.c2e864c8.js' );
        } catch ( e ) {}
        try {
            plug = grunt.file.read( 'public2/js/plugin.24d54461.js' );
        } catch ( e ) {}
        try {
            style = grunt.file.read( 'public2/css/main.b6f17edb.css' );
        } catch ( e ) {}

        test.ok( main, 'should have created main js file with hash in proper directory' );
        test.ok( plug, 'should have created plugin js file with hash in proper directory' );
        test.ok( style, 'should have created main css file with hash in proper directory' );
        test.equal( actual, expected, 'PHP prod config files should be identical' );

        test.done();
    },
    dist3: function ( test ) {
        test.expect( 1 );

        var task = grunt.config( 'versioning' ).dist3,
            actual = grunt.file.read( task.options.outputConfigDir + '/assets.config.php' ),
            expected = grunt.file.read( fixtures + '/assets.config.dev.php' );

        test.equal( actual, expected, 'PHP dev config files should be identical' );

        test.done();
    },
    prod: function ( test ) {
        test.expect( 6 );

        var config = grunt.config.get( 'versioningConfig:prod' ),
            task = grunt.config( 'versioning' ).prod,
            dest = task.options.cwd,
            actual = grunt.file.read( task.options.outputConfigDir + '/assets.config.json' ),
            expected = grunt.file.read( fixtures + '/assets.config.prod.json' );

        function loopFiles ( files ) {
            files.forEach( function ( src ) {
                var file;
                try {
                    file = grunt.file.read( dest + '/' + src );
                } catch ( e ) {}

                test.ok( file, 'file ' + dest + '/' + src + ' in config exists' );
            });
        }

        for ( var key in config ) {
            if ( config.hasOwnProperty( key ) ) {
                loopFiles( config[ key ].js );
                loopFiles( config[ key ].css );
            }
        }

        test.ok( config, 'should have set a config object' );
        test.equal( actual, expected, 'JSON config files should be identical' );

        test.done();
    },
    dev: function ( test ) {
        test.expect( 12 );

        var config = grunt.config.get( 'versioningConfig:dev' ),
            task = grunt.config( 'versioning' ).dev,
            dest = task.options.cwd,
            actual = grunt.file.read( task.options.outputConfigDir + '/assets.config.json' ),
            expected = grunt.file.read( fixtures + '/assets.config.dev.json' );

        function loopFiles ( files ) {
            files.forEach( function ( src ) {
                var file;
                try {
                    file = grunt.file.read( dest + '/' + src );
                } catch ( e ) {}

                test.ok( file, 'file ' + dest + '/' + src + ' in config exists' );
            });
        }

        for ( var key in config ) {
            if ( config.hasOwnProperty( key ) ) {
                loopFiles( config[ key ].js );
                loopFiles( config[ key ].css );
            }
        }

        test.ok( config, 'should have set a config object' );
        test.equal( actual, expected, 'JSON config files should be identical' );

        test.done();
    }
};