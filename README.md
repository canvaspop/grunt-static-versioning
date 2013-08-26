grunt-versioning
================

> Version static assets

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-static-version --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-static-version');
```

**NOTE: This plugin requires some extra work on your end. It will create the versioned assets and a config file (PHP and JSON at the moment, more to come), but you will need to write an adapter to use that config. There will be examples in this repo under `examples`.**

### Options

#### dest

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

Specify the type of config file to generate. This will generate an `assets.config.[ PHP|JSON ]` file which can be used to insert the proper files in the source. The config file will only contain paths to development or minified files depending on the `env` option. Can be: `json` or `php`.

#### outputConfigDir

Type: `String`  
Default: ''

Specify the location where the config file will be generated. If left empty, it will used the `dest` option.

#### namespace

Type: `String`  
Default: 'static.assets'

Namespace wrapping the file assets config generated file.

### Files array options

#### assets

Type: `Array`  
Default: null

An array of files that will be versioned. They can be manually entered or leveraged from the `uglify` and `cssmin` tasks. **NOTE: If the files are provided manually, they MUST exist. This task does NOT concat/minify any files, it simply renames and copies existing files to proper location.**

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

### Usage Examples

#### Example config

```javascript
grunt.initConfig({
  versioning: {               // Task
    options: {                // Task options
      dest: ''
    },
    dist: {                   // Target
      options: {              // Target options
      },
      files: [{
        assets: [{
            src: [ 'file1.js', 'file2.js' ],
            dest: 'tmp/js/main.min.js',
            versioningParent: 'global'
        }, {
            src: [ 'plugin1.js', 'plugin2.js' ],
            dest: 'tmp/js/plugin.min.js',
            versioningParent: 'global'
        }],
        dir: 'js',
        type: 'js',
        ext: '.min.js'
      }, {
        assets: [{
            src: [ 'main.css' ],
            dest: 'tmp/css/main.min.css',
            versioningParent: 'global'
        }],
        dir: 'css',
        type: 'css',
        ext: '.min.css'
      }]
    }
  }
});

grunt.loadNpmTasks('grunt-static-versioning');

grunt.registerTask('default', ['jshint', 'versioning']);
```

#### Leveraging other tasks

This task is built to leverage other existing tasks. Instead of manually providing the files array, it can be read from `uglify` and `cssmin` tasks.

```javascript
grunt.initConfig({
  cssmin: {
    dist: {
      files: [{
        src: [ 'main.css' ],
        dest: 'tmp/main.min.css',
        versioningParent: 'global'   // Used to group files in the assets.config
      }]
    }
  },

  uglify: {
    dist: {
      files: [{
        src: [
          'file1.js',
          'file2.js',
          'components/test/test.js'
        ],
        dest: 'tmp/main.min.js',
        versioningParent: 'global'   // Used to group files in the assets.config
      }, {
        src: [
          'file3.js',
          'file4.js'
        ],
        dest: 'tmp/plugin.min.js',
        versioningParent: 'global'   // Used to group files in the assets.config
      }]
    }
  },

  versioning: {
    options: {
      dest: 'public'
    },
    dist: {
      files: [{
        assets: '<%= uglify.dist.files %>',
        dir: 'js',
        type: 'js',
        ext: '.min.js'
      }, {
        assets: '<%= cssmin.dist.files %>',
        dir: 'css',
        type: 'css',
        ext: '.min.css'
      }]
    }
  }
});
```

The above example would output:
* `public/js/main.[ MD5_HASH ].min.js`
* `public/js/plugin.[ MD5_HASH ].min.js`
* `public/css/main.[ MD5_HASH ].min.css`

#### Generated config file

```javascript
grunt.initConfig({
  versioning: {
    options: {
      dest: 'public'
    },
    dist: {
      options: {
        output: 'php',
        outputConfigDir: 'public/config'
      },
      files: [{
        assets: '<%= uglify.dist.files %>',
        dir: 'js',
        type: 'js',
        ext: '.min.js'
      }, {
        assets: '<%= cssmin.dist.files %>',
        dir: 'css',
        type: 'css',
        ext: '.min.css'
      }]
    }
  }
});
```

The above will generate a `public/config/assets.config.php` file.

## Sample assets.config

### JSON

#### Prod

```javascript
{
  "staticAssets": {
    "global": {                // <--- taken from the `versioningParent`
      "js": [
        "main.c2e864c8.js",
        "plugin.24d54461.js"
      ],
      "css": [
        "main.b6f17edb.css"
      ]
    },
    "all": {                   // <--- taken from the `versioningParent`
      "js": [
        "all.625a4fd0.js"
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
    "global": {                // <--- taken from the `versioningParent`
      "js": [
        "test/src/js/file1.js",
        "test/src/js/file2.js",
        "test/components/test/test.js",
        "test/src/js/file3.js",
        "test/src/js/file4.js"
      ],
      "css": [
        "test/src/css/main.css"
      ]
    },
    "all": {                   // <--- taken from the `versioningParent`
      "js": [
        "test/src/js/file1.js",
        "test/src/js/file2.js",
        "test/src/js/file3.js",
        "test/src/js/file4.js"
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
                'test/src/css/main.css',
            ),
            'js' => array(
                'test/src/js/file1.js',
                'test/src/js/file2.js',
                'test/components/test/test.js',
                'test/src/js/file3.js',
                'test/src/js/file4.js',
            ),
        ),
        'all' => array(
            'css' => array(
            ),
            'js' => array(
                'test/src/js/file1.js',
                'test/src/js/file2.js',
                'test/src/js/file3.js',
                'test/src/js/file4.js',
            ),
        ),
    )
);
```

## Release history

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
