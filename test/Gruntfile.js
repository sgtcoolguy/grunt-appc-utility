'use strict';

// NOTE: this grunt file is only used for testing

module.exports = function (grunt) {
	// NOTE: this file will be placed in an arrow project with the tasks folder
	grunt.loadTasks('tasks');

	grunt.initConfig({
		appc_ssl: {
			good: {
				src: [
					'fake/appc.com.crt',
					'fake/appc.com.other.crt',
					'fake/appc.com.key',
				],
				dest: 'build/appc.com.pem'
			},
			nopem: {
				src: [
					'fake/appc.com.crt',
					'fake/appc.com.other.crt',
					'fake/appc.com.key',
				],
				dest: 'build/appc.com'
			},
			missing: {
				src: [
					'fake/appc.com.crt',
					'fake/appc.com.other.crt',
					'fake/fingers.key',
					'fake/appc.com.key'
				],
				dest: 'build/appc.com.pem'
			}
		}
	});
};