# grunt-static-versioning [![Build Status](https://secure.travis-ci.org/canvaspop/grunt-static-versioning.png?branch=master)](http://travis-ci.org/canvaspop/grunt-static-versioning)

> Version static assets

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-static-versioning --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-static-versioning');
```

**NOTE: This plugin requires some extra work on your end. It will create the versioned assets and a config file (PHP and JSON at the moment with more to come), but you will need to write an adapter to use that file. There will be examples in this repo under the `examples` directory.**

### Options

#### cwd

Type: `String`  
Default: ''

Specify the location of the outputted files. This is generally the root folder of the web project, e.g. the public directory. This path is **excluded** from the final file output.

#### env

Type: `String`  
Default: 'prod'

Specify which files the task will copy over to the destination directory. Can be: `prod` or `dev`.

#### output

Type: `String`  
Default: 'json'

Specify the type of config file to generate. This will generate an `assets.config.[ EXTENSION ]` file which can be used to insert the proper files in the source. The config file will only contain paths to development or minified files based on the `env` option. Can be: `json` or `php`.

#### outputConfigDir

Type: `String`  
Default: ''

Specify the location where the config file will be generated. If left empty, it will used the `cwd` option.

#### namespace

Type: `String`  
Default: 'static.assets'

Namespace wrapping the file assets config generated file.

### Files array options

#### assets

Type: `Array`  
Default: null

An array of files that will be versioned. They can be manually entered or leveraged from the `uglify` and `cssmin` tasks. **NOTE: If the files are provided manually, they MUST exist. This task does NOT concat/minify any files, it simply renames and copies existing files to proper destination.**

#### dest

Type: `String`  
Default: ''

Offers an additional level of organization. The task options' `dest` paramater provided access to the web public folder while this option offers the organizational directories. E.g. `js` and `css`.

#### type

Type: `String`  
Default: ''

This option is used to create structure to the config object the task creates. Can be: `js` or `css`.

#### ext

Type: `String`  
Default: ''

The extension to apply to the files. Files will follow the naming pattern: `[filename].[md5_hash].[ext]`. E.g.: `.js`, `.css`, `.min.js`, `.min.css`.

#### key

Type: `String`  
Default: ''

The key is used to organize the files in the config file. The same key can be used multiple times to organized multiples files together.

#### bypass

Type: `Boolean`  
Default: false

If set to true, the file will bypass versioning and simply append the given extension.

### Usage Examples

#### Example config

```javascript
grunt.initConfig({
  versioning: {               // Task
    options: {                // Task options
      cwd: ''
    },
    dist: {                   // Target
      options: {              // Target options
      },
      files: [{
        assets: [{
            src: [ 'file1.js', 'file2.js' ],
            dest: 'tmp/js/main.min.js'
        }, {
            src: [ 'plugin1.js', 'plugin2.js' ],
            dest: 'tmp/js/plugin.min.js'
        }],
        key: 'global',
        dest: 'js',
        type: 'js',
        ext: '.min.js'
      }, {
        assets: [{
            src: [ 'main.css' ],
            dest: 'tmp/css/main.min.css'
        }],
        key: 'global',
        dest: 'css',
        type: 'css',
        ext: '.min.css'
      }]
    }
  }
});

grunt.loadNpmTasks('grunt-static-versioning');

grunt.registerTask('default', ['versioning']);
```

#### Leveraging other tasks

This task is built to leverage other existing tasks. Instead of manually providing the files array, it can be read from the `uglify` and `cssmin` tasks.

```javascript
grunt.initConfig({
  cssmin: {
    main: {
      files: [{
        src: [ 'main.css' ],
        dest: 'tmp/main.min.css'
      }]
    }
  },

  uglify: {
    main: {
      files: [{
        src: [
          'file1.js',
          'file2.js',
          'components/test/test.js'
        ],
        dest: 'tmp/main.min.js'
      }]
    },
    plugin: {
      files: [{
        src: [
          'file3.js',
          'file4.js'
        ],
        dest: 'tmp/plugin.min.js'
      }]
    }
  },

  versioning: {
    options: {
      cwd: 'public',
      outputConfigDir: 'public/config'
    },
    dist: {
      files: [{
        assets: '<%= uglify.main.files %>',
        key: 'global',
        dest: 'js',
        type: 'js',
        ext: '.min.js'
      }, {
        assets: '<%= uglify.plugin.files %>',
        key: 'global',
        bypass: true,
        dest: 'js',
        type: 'js',
        ext: '.min.js'
      }, {
        assets: '<%= cssmin.main.files %>',
        key: 'global',
        dest: 'css',
        type: 'css',
        ext: '.min.css'
      }]
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-static-versioning');

grunt.registerTask('default', ['uglify', 'cssmin', 'versioning']);
```

The above example would output:
* `public/js/main.[ MD5_HASH ].min.js`
* `public/js/plugin.min.js` (no hash because of `bypass` option)
* `public/css/main.[ MD5_HASH ].min.css`
* `public/config/assets.config.json`

## Sample assets.config

### JSON

#### Prod

```javascript
{
  "staticAssets": {
    "global": {                // <--- 'key' option
      "js": [
        "/js/main.c2e864c8.min.js",
        "/js/plugin.min.js"
      ],
      "css": [
        "/css/main.b6f17edb.min.css"
      ]
    },
    "all": {                   // <--- 'key' option
      "js": [
        "/js/all.625a4fd0.min.js"
      ],
      "css": []
    }
  }
}
```

#### Dev

```javascript
{
  "staticAssets": {
    "global": {                // <--- 'key' option
      "js": [
        "/js/file1.js",
        "/js/file2.js",
        "/js/test.js",
        "/js/file3.js",
        "/js/file4.js"
      ],
      "css": [
        "/css/main.css"
      ]
    },
    "all": {                   // <--- 'key' option
      "js": [
        "/js/file1.js",
        "/js/file2.js",
        "/js/file3.js",
        "/js/file4.js"
      ],
      "css": []
    }
  }
}
```

### PHP

#### Prod

```php
<?php
return array(
    'staticAssets' => array(
        'global' => array(
            'css' => array(
                'css/main.b6f17edb.css',
            ),
            'js' => array(
                'js/main.c2e864c8.js',
                'js/plugin.24d54461.js',
            ),
        ),
        'all' => array(
            'css' => array(
            ),
            'js' => array(
                'js/all.625a4fd0.js',
            ),
        ),
    )
);
```

#### Dev

```php
<?php
return array(
    'staticAssets' => array(
        'global' => array(
            'css' => array(
                '/css/main.css',
            ),
            'js' => array(
                '/js/file1.js',
                '/js/file2.js',
                '/js/test.js',
                '/js/file3.js',
                '/js/file4.js',
            ),
        ),
        'all' => array(
            'css' => array(
            ),
            'js' => array(
                '/js/file1.js',
                '/js/file2.js',
                '/js/file3.js',
                '/js/file4.js',
            ),
        ),
    )
);
```

## Release history

* 2013-12-03 0.2.1
* 2013-09-17 0.2.0
* 2013-08-26 0.1.1 Initial release. Not yet officially released.
* 2013-08-26 0.1.0 Initial release. Not yet officially released.

## License

Copyright (c) 2013 CanvasPop

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
