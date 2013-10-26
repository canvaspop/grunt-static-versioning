<?php
return array(
    'static.assets' => array(
        'global' => array(
            'css' => array(
                '/test/src/css/main.css',
            ),
            'js' => array(
                '/test/src/js/file1.js',
                '/test/src/js/file2.js',
                '/test/components/test/test.js',
                '/test/src/js/file3.js',
                '/test/src/js/file4.js',
            ),
        ),
        'all' => array(
            'css' => array(
            ),
            'js' => array(
                '/test/src/js/file1.js',
                '/test/src/js/file2.js',
                '/test/src/js/file3.js',
                '/test/src/js/file4.js',
            ),
        ),
        'skip' => array(
            'css' => array(
            ),
            'js' => array(
                '/test/src/js/file1.js',
                '/test/src/js/file2.js',
            ),
        ),
    )
);
