'use strict';

const exec = require('child_process').exec;

module.exports = function (grunt) {
    grunt.registerTask('unpublish', 'Unpublish all Arrow versions except for last deployed version.', function () {
        const done = this.async();
        exec('appc acs publish --list_versions', function (error, stdout, stderr) {
            if (error || stderr) {
                // grunt will immediately abort
                grunt.fail.fatal(error || stderr);
            }

            const
                REGEXP_VERSIONS = /versions: ((?:(?:, )?[0-9]+\.[0-9]+\.[0-9]+)+)\..+currently: ([0-9]+\.[0-9]+\.[0-9]+)/,
                matches = stdout.match(REGEXP_VERSIONS);

            if (!matches) {
                return done();
            }

            const
                // --list_versions should print out the deployed versions in ascending order
                all = matches[1].split(', '),
                lastDeployed = matches[2];

            // if only one deployed version found, do nothing
            if (all.length === 1) {
                return done();
            }

            let p = Promise.resolve();
            all.forEach(function (version) {
                if (version !== lastDeployed) {
                    p = p.then(function () {
                        return new Promise(function (resolve) {
                            grunt.log.write(`Unpublishing: ${version}`);
                            exec(`appc acs unpublish --ver ${version}`, resolve);
                        });
                    });
                }
            });
            p.then(function () {
                done();
            });
        });
    });

    // in case anyone wants a quick session on ssl and encryption: http://how2ssl.com/articles/working_with_pem_files/
    grunt.registerMultiTask('ssl', 'Generate a .pem file using the specified certificates and/or key files.', function () {
        this.files.forEach(function (fileObj) {
            // this will (hopefully) ensure that the sepecified destination path contains .pem extension
            if (!/\.pem$/.test(fileObj.dest)) {
                // grunt will immediately abort
                grunt.fail.fatal(`'${fileObj.dest}' does not contain a '.pem' extension.`);
            }

            /*
                the order of certificates/keys that are contained in the .pem file matters:
                    http://serverfault.com/questions/476576/how-to-combine-various-certificates-into-single-pem
                    https://www.digicert.com/ssl-support/pem-ssl-creation.htm

                the order should be decided by the user
            */
            let pemContent = '';
            fileObj.src.forEach(function (filePath) {
                if (!grunt.file.exists(filePath)) {
                    // grunt will immediately abort
                    grunt.fail.fatal(`'${filePath}' does not exist.`);
                }
                pemContent += `${grunt.file.read(filePath)}\n`;
            });
            grunt.file.write(fileObj.dest, pemContent);
        });
    });
};