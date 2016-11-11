// NOTE: used for development and testing; should be deleted later

'use strict';

module.exports = function (grunt) {
    grunt.loadTasks('tasks');

    grunt.initConfig({
        ssl: {
            foo: {
                src: [
                    'conf/pubsub.appcelerator.com.crt',
                    'conf/gd_intermediate.crt',
                    'conf/pubsub.appcelerator.com.key',
                ],
                dest: 'build/pubsub.appcelerator.com.pe'
            }
        }
    });

    grunt.registerTask('default', ['ssl']);
};