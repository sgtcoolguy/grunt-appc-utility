'use strict';

// for the below tasks, it seems like this is the only way to run a grunt plugin within a grunt plugin
module.exports = function (grunt) {
    require('grunt-appc-istanbul')(grunt);
    require('grunt-appc-js/tasks/appc_js.js')(grunt);

    const
        APPC_ISTAN_RUN_TASK = 'AppcIstanbul_setupAndRun',
        THIS_ISTAN_RUN_TASK = 'istanbul_run';
    grunt.registerMultiTask(THIS_ISTAN_RUN_TASK, `grunt-appc-istanbul's '${APPC_ISTAN_RUN_TASK}' task.`, function () {
        const configObj = grunt.config.get(THIS_ISTAN_RUN_TASK);

        for (let target in configObj) {
            /*
                the waitForLog property will be optional to the user.
                if it doesn't exist (per target), use the 'server started on port 8080' log; this is the default printed log from arrow apps.
            */
            if (!configObj[target].waitForLog) {
                configObj[target].waitForLog = 'server started on port 8080';
            }
        }

        grunt.config.set(APPC_ISTAN_RUN_TASK, configObj);
        grunt.task.run(APPC_ISTAN_RUN_TASK);
    });

    const
        APPC_ISTAN_REPORT_TASK = 'AppcIstanbul_makeReport',
        THIS_ISTAN_REPORT_TASK = 'istanbul_report';
    grunt.registerMultiTask(THIS_ISTAN_REPORT_TASK, `grunt-appc-istanbul's '${APPC_ISTAN_REPORT_TASK}' task.`, function () {
        const configObj = grunt.config.get(THIS_ISTAN_REPORT_TASK);

        for (let target in configObj) {
            /*
                the options property will be optional to the user.
                if it doesn't exist (per target), use 'options: {cobertura: true}'; this will coincide with the jenkins cobertura plugin
            */
            if (!configObj[target].options) {
                configObj[target].options = {cobertura: true};
            }
        }

        grunt.config.set(APPC_ISTAN_REPORT_TASK, configObj);
        grunt.task.run(APPC_ISTAN_REPORT_TASK);
    });
};