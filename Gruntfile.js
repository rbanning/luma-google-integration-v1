/**
 * Created by rbanning on 7/6/2015.
 */
(function (module) {
    'use strict';
    module.exports = function (grunt) {

        require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

        var concat_options = {
            separator: grunt.util.linefeed + "/** end lib **/" + grunt.util.linefeed,
            banner: "/** JS :: "
            + '<%= pkg.name %> - v<%= pkg.version %>'
            + " :: "
            + '<%= grunt.template.today("yyyy-mm-dd") %>'
            + " **/" + grunt.util.linefeed
        };

        var config = {

            pkg: grunt.file.readJSON('package.json'),

            clean: {
                log: 'logs',
                working: 'working',
                cache: 'cache'
            },

            /* JAVASCRIPT */

            jshint: {
                options: {
                    asi: true,
                    browser: true,
                    curly: true,
                    devel: true,		//ok to leave console.log in the code??
                    eqeqeq: true,
                    eqnull: true,
                    latedef: true,
                    laxbreak: true,
                    laxcomma: true,
                    noarg: true,
                    nonbsp: true,
                    strict: true,
                    undef: true,
                    unused: false,
                    globals: {
                        jQuery: true,
                        moment: true,
                        angular: true,
                        gapi: true
                    },
                    reporter: require('jshint-stylish')
                },
                build: {
                    options: {
                        //option overrides
                        reporterOutput: 'logs/jshint-build.txt'
                    },
                    files: {
                        src: ['assets/dev/js/**/*.js']
                    }
                }
            },


            concat: {
                build: {
                    options: concat_options,
                    files: {
                        'assets/dist/js/app.js': ['assets/dev/js/**/*.js']
                    }
                },
                vendor: {
                    options: concat_options,
                    files: {
                        'assets/dist/js/vendor.min.js': ['bower_components/angular-local-storage/dist/angular-local-storage.min.js']
                    }
                }
            },

            uglify: {
                build: {
                    files: {
                        'assets/dist/js/app.min.js': ['assets/dist/js/app.js']
                    }
                }
            },


            /*  LESS / SASS / CSS  */

            less: {
                build: {
                    files: {
                        'assets/dev/css/app-compiled.css': 'assets/dev/less/master.less'
                    }
                }
            },

            autoprefixer: {
                build: {
                    options: {
                        browsers: ['last 1 versions', '> 1%']
                    },
                    expand: true,
                    flatten: true,
                    files: {
                        'assets/dev/css/app-prefixed.css': 'assets/dev/css/app-compiled.css'
                    }
                }
            },

            cssc: {
                build: {
                    options: {
                        consolidateViaDeclarations: true,
                        consolidateViaSelectors: true,
                        consolidateMediaQueries: true
                    },
                    files: {
                        'assets/dist/css/app.css': 'assets/dev/css/app-prefixed.css'
                    }
                }
            },

            cssmin: {
                build: {
                    src: 'assets/dist/css/app.css',
                    dest: 'assets/dist/css/app.min.css'
                }
            },


            // -- COPY -- //
            copy: {
                vendor: {
                    files: {
                        'assets/dist/js/angular-local-storage.min.js.map': 'bower_components/angular-local-storage/dist/angular-local-storage.min.js.map'
                    }
                }
            },

            // -- SFTP -- //

            watch: {

                build_js: {
                    files: ['assets/dev/js/**/*.js'],
                    tasks: ['build_js']
                },
                build_css: {
                    files: ['assets/dev/less/**/*.less'],
                    tasks: ['build_css']
                },
                build: {
                    files: ['assets/dev/js/**/*.js', 'assets/dev/less/**/*.less'],
                    tasks: ['build_js', 'build_css']
                }
            }
        };

        grunt.initConfig(config);


        grunt.registerTask('build_css', ['less:build', 'autoprefixer:build', 'cssc:build', 'cssmin:build']);
        grunt.registerTask('build_js', ['jshint:build', 'concat:build', 'uglify:build']);

        grunt.registerTask('build_vendor', ['concat:vendor', 'copy:vendor']);

        grunt.registerTask('default', []);


    };
}(module));
