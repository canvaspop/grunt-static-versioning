/**
 * Versioned helper adds two methods that allow the rendering of given assets.
 *
 * @example
 * <%- renderLinksTags( KEY ) %>
 * <%- renderScriptsTags( KEY ) %>
 *
 * <!-- the following will look through the assets.config.json file and try to
 * find the key passed as an argument, if found it loops through each file and
 * appends them to the page -->
 * <%- renderLinksTags( 'global' ) %>
 * <%- renderScriptsTags( 'global' ) %>
 *
 * @param  {Object} app Express app
 * @return {undefined}
 */
module.exports = function ( app ) {
    var config = __dirname + '/config/assets.config.json',
        fs = require( 'fs' ),
        data = fs.readFileSync( config );

    // parse the JSON content
    data = JSON.parse( data );

    // add helper methods
    app.locals( {
        // render all <link> tags based on key
        renderLinksTags: function ( key ) {
            // `staticAssets`: default namespace of the grunt-static-versioning plugin
            var obj = data.staticAssets[ key ];
            if ( obj && obj.css ) {
                return obj.css.map( function ( src ) {
                    return '<link rel="stylesheet" href="' + src + '">';
                } ).join( '\n ' );
            } else {
                return '';
            }
        },

        // render all <script> tags based on key
        renderScriptsTags: function ( key ) {
            // `staticAssets`: default namespace of the grunt-static-versioning plugin
            var obj = data.staticAssets[ key ];
            if ( obj && obj.js ) {
                return obj.js.map( function ( src ) {
                    return '<script src="' + src + '"></script>';
                } ).join( '\n ' );
            } else {
                return '';
            }
        }
    } );
};