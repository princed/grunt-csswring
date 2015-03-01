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
     * @param {string} to Output path
     * @returns {{css: string, map?: string}}
     */
    function minify(input, to) {
        return minifier.process(input, {
            inlineMap: options.mapInline,
            map: options.map,
            to: to
        });
    }

    grunt.registerMultiTask('csswring', 'Minify CSS files using PostCSS-based CSSWring.', function() {
        options = this.options({
            banner: undefined,
            map: undefined,
            mapInline: undefined,
            preserveHacks: undefined,
            removeAllComments: undefined,
            report: 'min'
        });

        var processor = csswring({
          preserveHacks: !!options.preserveHacks,
          removeAllComments: !!options.removeAllComments
        }).postcss;

        minifier = postcss().use(processor);

        if (typeof options.banner === 'string') {
            minifier.use(setBanner(options.banner));
        }

        this.files.forEach(function(f) {
            var parsed = f.src
                .filter(function(filepath) {

                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                })
                .reduce(function(parsed, filepath) {
                    var input = grunt.file.read(filepath);
                    var output = postcss.parse(input, { from: filepath, map: getMapOption(filepath)});

                    return parsed ? parsed.append(output) : output;
                }, null);

            if (!parsed) {
                return;
            }

            var inputCss = parsed.toResult().css;
            var result = minify(parsed, f.dest);

            grunt.file.write(f.dest, result.css);
            grunt.log.writeln('File ' + chalk.cyan(f.dest) + ' created: ' + maxmin(inputCss, result.css, options.report === 'gzip') );

            if (result.map) {
                grunt.file.write(f.dest + '.map', result.map);
                grunt.log.writeln('File ' + chalk.cyan(f.dest + '.map') + ' created (source map).');
            }
        });
    });
};
