'use strict';

var path = require('path');
var postcss = require('postcss');
var csswring = require('csswring');
var chalk = require('chalk');
var maxmin = require('maxmin');

module.exports = function(grunt) {

    var options;
    var minifier;

    /**
     * Returns an input source map if a map path was specified
     * or options.map value otherwise
     * @param {string} from
     * @returns {string|boolean|undefined}
     */
    function getMapOption(from) {
        if (typeof options.map === 'string') {
            var mapPath = options.map + path.basename(from) + '.map';

            if (grunt.file.exists(mapPath)) {
                return grunt.file.read(mapPath);
            }
        }

        return options.map;
    }

    /**
     * Setup banner processor
     * @param {string} text
     * @returns {Function}
     */
    function setBanner(text) {
        return function(css) {
            css.prepend(postcss.comment({ text: text }));

            // New line after banner
            if (css.rules[1]) {
                css.rules[1].before = '\n';
            }
        };
    }

    /**
     * @param {string} input Input CSS
     * @param {string} from Input path
     * @param {string} to Output path
     * @returns {{css: string, map?: string}}
     */
    function minify(input, from, to) {
        return minifier.process(input, {
            map: getMapOption(from),
            inlineMap: options.mapInline,
            from: from,
            to: to
        });
    }

    grunt.registerMultiTask('csswring', 'Minify CSS files using PostCSS-based CSSWring.', function() {
        options = this.options({
            banner: undefined,
            map: undefined,
            mapInline: undefined,
            report: 'min'
        });

        var minifierOptions = {}

        if (options.preserveHacks) {
          minifierOptions.preserveHacks = true;
        }

        minifier = postcss().use(csswring(minifierOptions));

        if (typeof options.banner === 'string') {
            minifier.use(setBanner(options.banner));
        }

        this.files.forEach(function(f) {
            f.src
                .filter(function(filepath) {

                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                })
                .forEach(function(filepath) {
                    var dest = f.dest || filepath;
                    var input = grunt.file.read(filepath);
                    var output = minify(input, filepath, dest);

                    grunt.file.write(dest, output.css);
                    grunt.log.writeln('File ' + chalk.cyan(dest) + ' created: ' + maxmin(input, output.css, options.report === 'gzip') );

                    if (output.map) {
                        grunt.file.write(dest + '.map', output.map);
                        grunt.log.writeln('File ' + chalk.cyan(dest + '.map') + ' created (source map).');
                    }
                });
        });
    });
};
