# grunt-csswring

> Source Maps aware CSS minification task. Based on [CSSWring](https://github.com/hail2u/node-csswring) based on [PostCSS](https://github.com/ai/postcss).

[![Dependency Status](https://gemnasium.com/princed/grunt-csswring.svg)](https://gemnasium.com/princed/grunt-csswring)

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-csswring --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-csswring');
```

## The “csswring” task

### Overview
In your project's Gruntfile, add a section named `csswring` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  csswring: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.banner
Type: `String|undefined`
Default value: `undefined`

Allows to add comment to the beginning of minified files.

#### options.map
Type: `Boolean|String|undefined`
Default value: `undefined`

If the map option isn't defined, PostCSS will look for source map from a previous compilation step (either inline map or separate one) and update it automatically. Let's say you have `path/file.css` and `path/file.css.map` from SASS, PostCSS will find that map, update it and save to a specified destination.

If `true` is specified, PostCSS will try to find an input source map file as described above and generate a new map based on the found one (or just generate a new map, unlike the situation when the map option is undefined).

If you keep your map from a pre-processor in another directory (e.g. `path/file.css` and `another-path/file.css.map`), you can specify the path `another-path/` in the map option to point out where grunt-csswring should look for an input map to update it.

Also you can specify `false`. In that case PostCSS will not generate or update source map even if there is one from a previous compilation step near an input file or inlined to it (PostCSS will delete a map annotation comment from an input file).

You cannot specify a path where to save a map file, it will be saved at the same directory as the output CSS file or inlined to it (check out the option below).

#### options.mapInline
Type: `Boolean|undefined`
Default value: `undefined`

If the option isn't specified, PostCSS will inline its map if a map from a previous compilation step was inlined to an input file or save its map as a separate file respectively.

You can specify `true` or `false` to force that behaviour as you like.

#### options.preserveHacks
Type: `Boolean|undefined`
Default value: `undefined`

Allows to preserve properties hacks like `*display: inline;`

#### options.removeAllComments
Type: `Boolean|undefined`
Default value: `undefined`

By default, CSSWring keeps a comment that start with `/*!`. If you want to remove all comments, set option to `true`.

#### options.report
Choices: `min`, `gzip`
Default value: `min`
Either report only minification result or report minification and gzip results. Using `gzip` will make the task take 5-10x longer to complete.


### Usage Examples

```js
grunt.initConfig({

  csswring: {

    options: {
      // Task-specific options go here.
    },

    // minify the specified file
    single_file: {
      options: {
        // Target-specific options go here.
      },
      src: 'src/css/file.css',
      dest: 'dest/css/file.css'
    },

    // minify all files
    multiple_files: {
      expand: true,
      flatten: true,
      src: 'src/css/*.css', // -> src/css/file1.css, src/css/file2.css
      dest: 'dest/css/' // -> dest/css/file1.css, dest/css/file2.css
    },

    // if you have specified only the `src` param, the destination will be set automatically,
    // so source files will be overwritten
    no_dest: {
      src: 'dest/css/file.css' // globbing is also possible here
    },

    sourcemap: {
        options: {
            map: true
        },
        src: 'src/css/file.css',
        dest: 'dest/css/file.css' // -> dest/css/file.css, dest/css/file.css.map
    },
  }
});
```

## Acknowledgements
This task is mostly based on [grunt-autoprefixer](https://github.com/nDmitry/grunt-autoprefixer) by Dmitry Nikitenko.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
