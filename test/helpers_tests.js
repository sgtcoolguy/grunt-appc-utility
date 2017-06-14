'use strict';

// NOTE: these tests should only focus on methods in tasks/helpers.js; the methods in tasks/other_plugins.js SHOULD have their own respective tests, since they're being extended from another plugin

const
	rimraf = require('rimraf'),
	spawn = require('child_process').spawn,
	fs = require('fs'),
	path = require('path'),
	assert = require('assert');

// dummy arrow app
const DUMMY = 'dummy';

before('setup', function (done) {
	// creating projects could take a long time; disable timeout
	this.timeout(0);

	// 'npm test' makes cwd at the root level of the project; switch to this test directory
	process.chdir('test');

	// create an arrow project to simulate and simulate usage of this plugin
	const
		args = [
			'new',
			'-t', 'arrow',
			'--name', DUMMY,
		],
		appcCmd = spawn('appc', args);
	appcCmd.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	appcCmd.stderr.on('data', function (data) {
		console.log(data.toString());
	});
	appcCmd.on('close', function (code) {
		// now, switch to the dummy arrow app
		process.chdir(DUMMY);

		// symlink files to this dummy arrow project
		fs.symlinkSync('../../tasks', 'tasks');
		fs.symlinkSync('../fake', 'fake');
		fs.symlinkSync('../Gruntfile.js', 'Gruntfile.js');

		done();
	});
});

after('cleanup', function (done) {
	console.log('--- cleanup ---');

	// get out of the dummy app
	process.chdir('..');

	// it takes a a long time to delete an arrow project from platform from jenkins; disable timeout
	this.timeout(0);

	new Promise(resolve => {
		// when running on jenkins, it's possible that there may be apps with the name DUMMY in a different org.
		// so, to delete this app, getting the current org id.
		let out = '';

		const whoami = spawn('appc', ['whoami', '-o', 'json']);
		whoami.stdout.on('data', function (output) {
			out += output.toString();
		});
		whoami.on('close', function () {
			resolve(JSON.parse(out).org_id);
		});
	})
	.then(function (org_id) {
		// delete the dummy app from 360 platform
		const appcRmCmd = spawn('appc', ['cloud', 'remove', DUMMY, '--org', org_id]);
		appcRmCmd.stdout.on('data', function (output) {
			console.log(output.toString());
		});
		appcRmCmd.stderr.on('data', function (output) {
			console.log(output.toString());
		});
		appcRmCmd.on('close', function () {
			// delete the dummy app from your local machine
			rimraf(DUMMY, done);
		});
	})
});

describe('appc_ssl', function () {
	// it takes a long time to validate anything on preprod plus jenkins; disable timeout
	this.timeout(0);

	// from Gruntfile.js
	const
		OUTPUT_DIR = 'build',
		SRC_DIR = 'fake';

	beforeEach(function (done) {
		rimraf(OUTPUT_DIR, done);
	});

	it('should generate a .pem file with all valid keys and certs', function (done) {
		// from appc_ssl:good target
		const
			PEM_FILE = path.join(OUTPUT_DIR, 'appc.com.pem'),
			CRT_FILE = path.join(SRC_DIR, 'appc.com.crt'),
			CRT_FILE_2 = path.join(SRC_DIR, 'appc.com.other.crt'),
			KEY_FILE = path.join(SRC_DIR, 'appc.com.key');

		const gruntCmd = spawn('grunt', ['appc_ssl:good']);
		gruntCmd.stdout.on('data', function (data) {
			// uncomment for debugging
			// console.log(data.toString());
		});
		gruntCmd.stderr.on('data', function (data) {
			// uncomment for debugging
			// console.log(data.toString());
		});
		gruntCmd.on('close', function (code) {
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

	it('should fail if .pem extension is not specified', function (done) {
		// from appc_ssl:nopem target
		const BAD_PEM = path.join(OUTPUT_DIR, 'appc.com');

		let errOutput = '';

		const gruntCmd = spawn('grunt', ['appc_ssl:nopem']);
		gruntCmd.stdout.on('data', function (data) {
			// capture only 'Fatal error' from output
			if (/^Fatal error/.test(data)) {
				errOutput += data;
			}
		});
		gruntCmd.stderr.on('data', function (data) {
			// uncomment for debugging
			// console.log(data.toString());
		});
		gruntCmd.on('close', function (code) {
			// check if there is an error message, indicating .pem extension is needed
			// NOTE: because errOutput contains an invisible character from stdout, need to use regular expression instead of strict equality for validation
			const
				correctErrText = `Fatal error: '${BAD_PEM}' does not contain a '.pem' extension.`,
				isTextGood = new RegExp(correctErrText).test(errOutput);
			assert.ok(isTextGood, 'Returned error message is not correct.');

			// check exit code is 1 i.e. grunt.fail.fatal should've been called
			assert.ok(code, 'Exit code is not 1.');

			// check no pem file was created
			assert.throws(function () {
				fs.statSync(PEM_FILE);
			}, null, '.pem file should not be created.');

			done();
		});
	});

	it('should fail if source files are missing', function (done) {
		// from appc_ssl:missing target
		const FILE_DOESNT_EXIST = path.join(SRC_DIR, 'fingers.key');

		let errOutput = '';

		const gruntCmd = spawn('grunt', ['appc_ssl:missing']);
		gruntCmd.stdout.on('data', function (data) {
			// capture only 'Fatal error' from output
			if (/^Fatal error/.test(data)) {
				errOutput += data;
			}
		});
		gruntCmd.stderr.on('data', function (data) {
			// uncomment for debugging
			// console.log(data.toString());
		});
		gruntCmd.on('close', function (code) {
			// check if there is an error message, indicating the specified source file doesn't exist
			// NOTE: because errOutput contains an invisible character from stdout, need to use regular expression instead of strict equality for validation
			const
				correctErrText = `Fatal error: '${FILE_DOESNT_EXIST}' does not exist.`,
				isTextGood = new RegExp(correctErrText).test(errOutput);
			assert.ok(isTextGood, 'Returned error message is not correct.');

			// check exit code is 1 i.e. grunt.fail.fatal should've been called
			assert.ok(code, 'Exit code is not 1.');

			done();
		});
	});
});

// skipping these tests because preprod is too unreliable to run these tests
describe.skip('appc_unpublish_all', function () {
	// publishing an arrow app takes forever; disabling timeout
	this.timeout(0);

	before(function (done) {
		// since we're still in the arrow app, publish it
		publishApp(done);
	});

	it('should not be able to unpublish first version', function (done) {
		let output = '';

		const gruntCmd = spawn('grunt', ['appc_unpublish_all']);
		gruntCmd.stdout.on('data', function (data) {
			output += data;
		});
		gruntCmd.stderr.on('data', function (data) {
			// uncomment for debugging
			// console.log(data.toString());
		});
		gruntCmd.on('close', function (code) {
			const logExist = /Only one published Arrow version; will not unpublish\./g.test(output);
			assert.ok(logExist, 'Retruned message does not exist');
			done();
		});
	});

	/*
		TODO: actually implement this test case (just, so tired)
		1. since this dummy app is already published at this point, publish again
		2. repeatedly call 'appc cloud list dummy' until second status changes to running
		3. call 'grunt appc_unpublish_all'
		4. check with 'appc cloud list dummy'
	*/
	it('should be able to unpublish multiple versions', function () {
		console.log('DO THIS PART MANUALLY vvv');
	});

	function publishApp(done) {
		const publishCmd = spawn('appc', ['publish']);
		publishCmd.stdout.on('data', function (data) {
			console.log(data.toString());
		});
		publishCmd.stderr.on('data', function (data) {
			console.log(data.toString());
		});
		publishCmd.on('close', function (code) {
			done();
		});
	}
});