'use strict';

// NOTE: these tests should only focus on methods in tasks/helpers.js; the methods in tasks/other_plugins.js SHOULD have their own respective tests, since they're being extended from another plugin

const
    rimraf = require('rimraf'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path'),
    assert = require('assert');

// 'npm test' makes cwd at the root level of the project; switch to this test folder
before(function () {
    process.chdir('test');
});

describe('appc_ssl', function () {
    // this is determined by the user in the Gruntfile.js
    const OUTPUT_DIR = 'build';

    before(function (done) {
        rimraf(OUTPUT_DIR, done);
    });

    it('should generate a .pem file with all valid keys and certs', function (done) {
        // and, these are determined by the user in the Gruntfile.js
        const
            PEM_FILE = path.join(OUTPUT_DIR, 'appc.com.pem'),
            CRT_FILE = path.join('fake', 'appc.com.crt'),
            CRT_FILE_2 = path.join('fake', 'appc.com.other.crt'),
            KEY_FILE = path.join('fake', 'appc.com.key');

        const gruntCmd = spawn('grunt', ['appc_ssl:good']);
        gruntCmd.stdout.on('data', function (data) {
            // uncomment for debugging
            // console.log(data.toString());
        });
        gruntCmd.stderr.on('data', function (data) {
            // uncomment for debugging
            // console.log(data.toString());
        });
        gruntCmd.on('close', function (data) {
            let pemSize = 0;
            assert.doesNotThrow(function () {
                pemSize = fs.statSync(PEM_FILE).size;
            });

            let contentSize = 0;
            const
                srcFiles = [CRT_FILE, CRT_FILE_2, KEY_FILE],
                TOTAL_NEW_LINES = srcFiles.length;
            srcFiles.forEach(function (srcFile) {
                contentSize += fs.statSync(srcFile).size;
            });
            // appc_ssl appends a '\n' to each source file it reads in
            contentSize += TOTAL_NEW_LINES;

            assert.strictEqual(pemSize, contentSize, `${PEM_FILE} is missing some content.`);

            done();
        });
    });
});

describe('appc_unpublish_all', function () {
    // before(function () {
    //     // 'npm test' makes cwd at the root level of the project; switch to this test folder
    //     process.chdir('test');
    // });

    it.skip('something something', function (done) {
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