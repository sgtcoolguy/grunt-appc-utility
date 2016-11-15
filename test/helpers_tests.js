'use strict';

// NOTE: tests will only focus on methods in tasks/helpers.js; the methods in tasks/other_plugins.js SHOULD have their own respective tests, since they're being extended from another plugin

const spawn = require('child_process').spawn;

describe('tasks/helpers.js', function () {
    before(function () {
        process.chdir('test')
    });

    it('appc_unpublish_all', function (done) {
        const
            args = [
                '--help'
            ],
            gruntCmd = spawn('grunt', args);

        gruntCmd.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        gruntCmd.stderr.on('data', function (data) {
            console.log(data.toString());
        });
        gruntCmd.on('close', function (data) {
            done();
        });
    });

    it('appc_ssl', function (done) {
        const
            args = [
                '--help'
            ],
            gruntCmd = spawn('grunt', args);

        gruntCmd.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        gruntCmd.stderr.on('data', function (data) {
            console.log(data.toString());
        });
        gruntCmd.on('close', function (data) {
            done();
        });
    });
});