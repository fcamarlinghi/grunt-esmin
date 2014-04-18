/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Francesco Camarlinghi
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

module.exports = function (grunt)
{
    'use strict';
    var path = require('path'),
        async = require('async'),
        compressor = require('yuicompressor');

    /**
     * Minifies the passed extendscript files using YUI.
     */
    var minifier = function (callback, source, dest)
    {
        compressor.compress(
            // Source can either be a file path or source code 
            source,
            // Options
            {
                charset: 'utf8',
                type: 'js',
                nomunge: true,
                'preserve-semi': true
            },
            // Compressor callback
            function (error, data, extra)
            {
                if (error)
                {
                    grunt.warn(error);
                    return callback();
                }

                if (extra)
                    grunt.log.writeln(extra);

                grunt.file.write(dest, data);
                callback();
            }
        );
    };

    // grunt esmin
    grunt.registerMultiTask('esmin', 'Concatenates and minifies ExtendScript files using YUI compressor.', function ()
    {
        var done = this.async(),
            tasks = [];

        if (!this.files.length)
            callback();

        this.files.forEach(function (file)
        {
            // Make sure we have valid destination files
            if (typeof file.dest !== 'string' || !file.dest.length)
                grunt.fatal('Invalid "dest" parameter: ' + String(file.dest).cyan + '.');

            if (!(file.src instanceof Array) || !file.src.length)
                grunt.fatal('No valid files specified in "src" array.');

            var concatenated = file.src.filter(function (filepath)
            {
                // Remove nonexistent files from queue
                if (!grunt.file.exists(filepath))
                {
                    grunt.fatal('Invalid "src" parameter: ' + String(file.src).cyan + '.');
                    return false;
                }
                else
                {
                    return true;
                }
            }).map(function (filepath)
            {
                // Load files and concatenate them
                return grunt.file.read(filepath);
            }).join('\n');

            // Enqueue minifier taks
            tasks.push(function (callback)
            {
                var message = 'Minifying: ' + file.src.join(', ').cyan + ' to ' + file.dest.cyan + '...';
                grunt.verbose.writeln(message).or.write(message);
                minifier(function () { grunt.verbose.or.ok(); callback(); }, concatenated, file.dest);
            });
        });

        // Run minifier
        async.series(tasks,
            function (err, result) { done(err, result); }
        );
    });
};