'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		appcJs: {
			src: [ 'Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js' ]
		},
		// Configure a mochaTest task
		mochaTest: {
			test: {
				options: {
					reporter: 'mocha-jenkins-reporter',
					'reporterOptions': {
						'junit_report_path': 'junit_report.xml'
					}
				},
				src: [ 'test/*_tests.js' ]
			}
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-appc-js');

	// register tasks
	grunt.registerTask('lint', [ 'appcJs' ]);
	grunt.registerTask('test', [ 'mochaTest' ]);
	grunt.registerTask('default', [ 'lint', 'test' ]);
};
