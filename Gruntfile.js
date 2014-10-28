module.exports = function (grunt) {

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-bower-task' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-contrib-htmlmin' );
    grunt.loadNpmTasks( 'grunt-includes' );

    grunt.initConfig({
    	src_directory: 'src/',

    	concat: {
    		options: {
    			separator: ';',
    			stripBanners: true
    		},

    		libs: {
    			src: [ 'src/js/*.js' ],
    			dest: 'dist/js/scripts.js'
    		},

    		dev: {
                src: [ 'src/js/*.js' ],
                dest: 'dist/js/scripts.dev.js'
            },

    		vendor: {
                options: {
                    stripBanners: false
                },

                src: [ "src/js/vendor/*.js", "src/js/vendor/**/dist/*.min.js" ],
                dest: "dist/js/vendor.js"
            }
    	},

    	jshint: {
            main: {
                options: {
                    jshintrc: ".jshintrc",
                    jshintignore: ".jshintignore"
                },

                files: {
                    src: ["src/js/*.js"]
                }
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    unused: true,
                    conditionals: true,
                    join_vars: true,
                    evaluate: true
                },
                preserveComments: false,
                mangle: false,
                sourceMap: true,
                sourceMapName: 'dist/js/js-source.map',
                sourceMapIncludeSources: true
            },

            myApp: {
                files: {
                    'dist/js/scripts.min.js': [ 'src/js/*.js' ]
                }
            }
        },

        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    precision: 8
                },

                files: {
                    'dist/styles/main.css': 'src/sass/main.scss'
                }
            }
        },

        watch: {
            js: {
                files: ["src/js/*.js"],
                tasks: ["jshint"]
            },

            scss: {
                files: ["src/sass/*.scss"],
                tasks: ["sass"]
            },

            min: {
                files: ['src/build/*.html'],
                tasks: ['htmlmin']
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: "src/img/",
                    src: ["*.{png,jpg,gif,svg}"],
                    dest: "dist/img/"
                }, {
                    expand: true,
                    cwd: "src/img/thumbs/",
                    src: ["*.{png,jpg,gif,svg}"],
                    dest: "dist/img/thumbs/"
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                files: {
                    "dist/index.html": "src/build/index.html"
                }
            }
        },

        includes: {
            build: {
                cwd: "src",
                src: [ "*.html" ],
                dest: "src/build/",
                options: {
                    flatten: true,
                    includePath: 'src/inc'
                }
            }
        }
    });

	grunt.registerTask( "build", [ "includes", "jshint", "concat:dev", "uglify", "imagemin", "htmlmin" ] );
    grunt.registerTask( "default", [ "build" ] );
    grunt.registerTask( "imgmin", [ "imagemin" ] );
    grunt.registerTask( "htmlminify", [ "htmlmin" ] );
    grunt.registerTask( "inc", [ "includes" ] );
    grunt.registerTask( "develop", [ "build" ] );

};