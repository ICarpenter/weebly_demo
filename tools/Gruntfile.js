module.exports = function (grunt) {
    var path = require('path'), fs = require('fs');
    var __slice = Array.prototype.slice;

    var modules = [];

    function internal() {
        return function () {
            return path.join.apply(null, ['../js/angular'].concat(__slice.call(arguments)));
        };
    }
    function external() {
        return function () {
            return path.join.apply(null, ['../server/public/_compiled/js'].concat(__slice.call(arguments)));
        };
    }


    //function dump(obj) { console.log(require('util').inspect(obj, { depth: null, colors: true })); }
    function not(path) { return '!' + path; }
    function rel(site) { return function (p) { return path.relative(dirs.private[site](), p); }; }

    var dirs = {
        private: {
            'weebly': internal()
        },
        public: {
            'weebly': external()
        }
    };

    var config = {
        jshint: {
            options: { jshintrc: '../js/.jshintrc' },
            gruntfile: {
                src: 'gruntfile.js'
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    // target.css file: source.less file
                    "../server/public/_compiled/css/main.css": "../less/**/*.less",
                }
            }
        },
        concat: { options: { separator: ';' } },
        template: {},
        copy: {
            target: {
                expand: true,
                flatten: true,
                cwd: '../server/public/bower_components/',
                src: ["../js/**/*.js", '!**/src/**/*.js', "!**/Gruntfile.js", "!**/js/**/*.js", "!**/grunt/**/*.js", "!node_modules/**/*.js"],
                dest: "../server/public/_compiled/js/vendor/"
            }
        },
        watch: {
            files: ['../js/angular/**/*.js', '../less/**/*.less'],
            tasks: ['jshint', 'less', 'concat', 'template'],
            options: {
                nospawn: true
            }
        },
    };

    Object.keys(dirs.private).forEach(function (dir) {
        var path = dirs.private[dir]();
        if(fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (mod) {
                if(!fs.lstatSync(dirs.private[dir](mod)).isSymbolicLink()) {
                    modules.push({ site: dir, name: mod });
                }
            });
        }
    });

    function buildModule(mod) {
        var dest = dirs.public[mod.site](mod.name + '.js'),
            template = dirs.public[mod.site](mod.name + '.templates.js'),
            modName = mod.site + '-' + mod.name,
            files = ['module.js', '**/*.js']
                        .map(function (path) { return dirs.private[mod.site](mod.name, path); });

        grunt.verbose.writeln('Building module config for ' + mod.name.cyan + ' from ' + mod.site.red);

        this.jshint[modName] = { src: dirs.private[mod.site](mod.name, '**/*.js') };

        this.concat[modName] = {
            src: files.concat(not(dirs.private[mod.site](mod.name, 'tests/**/*.js'))),
            dest: dest
        };

        this.template[modName] = {
            options: { module: mod.name.charAt(0).toUpperCase() + mod.name.slice(1), stripPath: rel(mod.site) },
            src: dirs.private[mod.site](mod.name, 'partials', '**/*.html'),
            dest: template
        };

        this.watch[modName] = {
            files: [dirs.private[mod.site](mod.name, '**/*.js')].concat(not(dirs.private[mod.site](mod.name, 'tests', '**/*.js'))),
            tasks: [modName]
        };
        this.watch[modName + '-templates'] = {
            files: dirs.private[mod.site](mod.name, 'partials', '**/*.html'),
            tasks: [modName + ':templates']
        };


        grunt.registerTask(modName, ['jshint:' + modName, 'concat:' + modName, 'template:' + modName]);
    }

    modules.forEach(buildModule, config);

    // dump(config);
    // throw null;

    fs.readdirSync('node_modules').forEach(function (dir) { if(/grunt-/.test(dir) && dir !== 'grunt-lib-contrib') { grunt.loadNpmTasks(dir); } });
    grunt.loadTasks('tasks');

    grunt.initConfig(config);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('build', ['watch']);
    grunt.registerTask('build', ['jshint', 'less', 'concat', 'copy', 'template', 'watch']);

    grunt.registerTask('default', ['lint'].concat(modules.map(function (mod) { return mod.site + '-' + mod.name; })));

};
