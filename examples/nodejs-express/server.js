/**
 * Create a basic express server to show function.
 *
 * The actual functionality happens in the `versioned.helper.js` file.
 *
 * To see in action, navigate to the nodejs-express directory (command line) and
 * run the following commands:
 *
 * First time only:
 * npm install
 *
 * Then start server with:
 * node server.js
 */
var express = require( 'express' ),
    app = express(),
    helper = require('./versioned.helper')( app );

// configure server
app.configure( function () {
    app.set( 'views', __dirname + '/views' );
    app.engine( 'html', require( 'ejs' ).renderFile );
    app.set( 'view engine', 'html' );
    app.use( express.static( __dirname + '/public' ) );
} );

// setup root route
app.get( '/', function ( req, res ) {
    res.render( 'index.html' );
} );

// start server
app.listen(3000);
