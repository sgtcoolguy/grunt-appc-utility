'use strict';

module.exports = function (grunt) {
	const
		APPC_ISTAN_RUN_TASK = 'AppcIstanbul_setupAndRun',
		THIS_ISTAN_RUN_TASK = 'appc_istanbul_run';
	grunt.registerMultiTask(THIS_ISTAN_RUN_TASK, 'Copy, instrument, and run the Arrow project.', function () {
		const configObj = grunt.config.get(THIS_ISTAN_RUN_TASK);

		/*
			'waitForLog' property will be optional to the user; if it's not specified, use 'server started on port 8080' log
			by default, arrow apps will print that log after it finishes launching
		*/
		_addDefaults(configObj, { waitForLog: 'server started on port 8080' });

		_runPlugin(grunt, 'grunt-appc-istanbul', APPC_ISTAN_RUN_TASK, configObj);
	});

	const
		APPC_ISTAN_REPORT_TASK = 'AppcIstanbul_makeReport',
		THIS_ISTAN_REPORT_TASK = 'appc_istanbul_report';
	grunt.registerMultiTask(THIS_ISTAN_REPORT_TASK, 'Create code coverage report and write into "dest".', function () {
		const configObj = grunt.config.get(THIS_ISTAN_REPORT_TASK);

		/*
			'options' property will be optional to the user; if it's not specified, use 'options': {cobertura: true}
			this will coincide with the jenkins cobertura plugin
		*/
		_addDefaults(configObj, { options: { cobertura: true } });

		_runPlugin(grunt, 'grunt-appc-istanbul', APPC_ISTAN_REPORT_TASK, configObj);
	});

	const
		APPC_JS_TASK = 'appcJs',
		THIS_JS_TASK = 'appc_js';
	grunt.registerMultiTask(THIS_JS_TASK, 'Lint, style, and library vulnerability checks for Appcelerator JavaScript', function () {
		const configObj = grunt.config.get(THIS_JS_TASK);

		// no need to use _addDefaults() i.e. don't need to customize default properties here
		_runPlugin(grunt, 'grunt-appc-js/tasks/appc_js.js', APPC_JS_TASK, configObj);
	});
};

/*
	an internal method that adds default properties to grunt.config object

	@param {Object} configObj - the object returned from grunt.config/grunt.config.get
	@param {Object} defaultsObj - a json object (key-value pairs) that contains the default key (string) and associated value (object) e.g:
	{
		'waitForLog': 'server started on port 8080',
		'options': {cobertura: true}
	}

*/
function _addDefaults(configObj, defaultsObj) {
	for (let target in configObj) {
		for (let defaultProp in defaultsObj) {
			// if the target does not contain the default property, then set one for the user
			if (!configObj[target][defaultProp]) {
				configObj[target][defaultProp] = defaultsObj[defaultProp];
			}
		}
	}
}

/*
	an internal method that runs a grunt task from the specified grunt npmModule.
	it seems like this is the only way to run a grunt plugin within a grunt plugin; extending an existing task.

	@param {Object} grunt - grunt object from the wrapper
	@param {String} npmModule - grunt npm node module
	@param {String} task - a task, from the grunt npmModule, to run
	@param {Object} config - the task's configuration object
*/
function _runPlugin(grunt, npmModule, task, config) {
	// by calling this require here, this prevents the help message (if any) and task name from appearing when running 'grunt --help'
	require(npmModule)(grunt); // eslint-disable-line security/detect-non-literal-require
	grunt.config.set(task, config);
	grunt.task.run(task);
}
