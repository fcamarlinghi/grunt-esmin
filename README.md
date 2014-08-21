# grunt-esmin
> A minimal Grunt plugin that concatenates and minifies ExtendScript files using YUI compressor.

## ExtendScript Compression

The ExtendScript interpreter is quite picky when it comes to file parsing and fails with files minified using, for example, UglifyJS and Closure. In my tests, YUI Compressor (used with non-aggressive options) is the only minifier that produced working results.

### So, why bother?
Given that the ExtendScript interpreter is much slower than nowadays Javascript engines, every performance boost we can get is good and minified/concatenated files decrease file loading and parsing time a little.

By using a compressor you can also subdivide your script into multiple files and have them assembled automatically, thus avoiding to work on a single monolythic script file or rely on expensive run-time calls to `$.evalFile`.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-esmin --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-esmin');
```

## esmin Task
_Run this task with the `grunt esmin` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### compress
Type: `Boolean`

Default: `true`

Whether to compress the output using YUI Compressor. If `false`, the task will only concatenates the files.

## Usage Examples

```js
esmin: {
  build: {
    files: [
      // Concatenates and minifies all JSX files within path to dest/minified.jsx
      {expand: true, src: ['path/*.jsx'], dest: 'dest/minified.jsx'}
    ]
  }
}
```

This task supports all the file mapping formats Grunt supports. Please read [Globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) and [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for additional details.

## License
Licensed under the MIT License.