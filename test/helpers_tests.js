'use strict';

const spawn = require('child_process').spawn;

describe('tasks/helpers.js', function () {
    it('appc_unpublish_all', function (done) {
        const
            args = [
                '--gruntfile', 'test/Gruntfile.js',
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