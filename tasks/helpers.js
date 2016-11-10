'use strict';

const exec = require('child_process').exec;

module.exports = function (grunt) {
    grunt.registerTask('unpublish', 'Unpublish all Arrow versions except for last deployed version.', function () {
        const done = this.async();

        exec('appc acs publish --list_versions', function (error, stdout, stderr) {
            if (error) {
                return grunt.fail.fatal(error);
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

/*
    grunt.registerTask('ssl', function () {
        function concat(callback, outfn) {
            var files = Array.prototype.slice.call(arguments,2),
                buffer;
            async.eachSeries(files, function(fn,cb){
                if (!fs.existsSync(fn)) {
                    return cb("Can't find file "+fn);
                }
                fs.readFile(fn, function(err,buf){
                    if (err) { return cb(err); }
                    buffer = !buffer ? buf : Buffer.concat([buffer,buf]);
                    buffer = Buffer.concat([buffer,new Buffer('\n')]);
                    cb();
                });
            },function(err){
                if (err) { return callback(err); }
                fs.writeFile(outfn, buffer, callback);
            });
        }

        var done = this.async(),
            ssldir = path.join(__dirname, 'conf');
        async.each(['entitlements-preprod.cloud.appctest.com', 'entitlements.appcelerator.com'], function (name, cb) {
            concat(cb,
                path.join(__dirname, name + '.pem'),
                path.join(ssldir, name + '.crt'),
                path.join(ssldir, 'gd_intermediate.crt'),
                path.join(ssldir, name + '.key')
            );
        }, done);
    });
*/
};