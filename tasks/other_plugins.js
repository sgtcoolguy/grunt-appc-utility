'use strict';

module.exports = function (grunt) {
    /*
        for the below tasks, it seems like this is the only way to run a grunt plugin within a grunt plugin.
        NOTE: if you run 'grunt --help', the help description from these plugins will also appear.
    */
    require('grunt-appc-istanbul')(grunt);
    require('grunt-appc-js/tasks/appc_js.js')(grunt);

    const
        APPC_ISTAN_RUN_TASK = 'AppcIstanbul_setupAndRun',
        THIS_ISTAN_RUN_TASK = 'appc_istanbul_run';
    grunt.registerMultiTask(THIS_ISTAN_RUN_TASK, `grunt-appc-istanbul's '${APPC_ISTAN_RUN_TASK}' task.`, function () {
        const configObj = grunt.config.get(THIS_ISTAN_RUN_TASK);

        /*
            'waitForLog' property will be optional to the user; if it's not specified, use 'server started on port 8080' log
            by default, arrow apps will print that log after it finishes launching
        */
        _addDefaults(configObj, {'waitForLog': 'server started on port 8080'});

        grunt.config.set(APPC_ISTAN_RUN_TASK, configObj);
        grunt.task.run(APPC_ISTAN_RUN_TASK);
    });

    const
        APPC_ISTAN_REPORT_TASK = 'AppcIstanbul_makeReport',
        THIS_ISTAN_REPORT_TASK = 'appc_istanbul_report';
    grunt.registerMultiTask(THIS_ISTAN_REPORT_TASK, `grunt-appc-istanbul's '${APPC_ISTAN_REPORT_TASK}' task.`, function () {
        const configObj = grunt.config.get(THIS_ISTAN_REPORT_TASK);

        /*
            'options' property will be optional to the user; if it's not specified, use 'options': {cobertura: true}
            this will coincide with the jenkins cobertura plugin
        */
        _addDefaults(configObj, {'options': {cobertura: true}});

        grunt.config.set(APPC_ISTAN_REPORT_TASK, configObj);
        grunt.task.run(APPC_ISTAN_REPORT_TASK);
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