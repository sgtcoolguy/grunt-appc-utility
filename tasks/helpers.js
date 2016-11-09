'use strict';

const child_process = require('child_process');

module.exports = function (grunt) {
    grunt.registerTask('unpublish', 'Unpublished old versions', function () {
        var REGEXP_VERSIONS = /versions: ((?:(?:, )?[0-9]+\.[0-9]+\.[0-9]+)+)\..+currently: ([0-9]+\.[0-9]+\.[0-9]+)/;
        var done = this.async();

        child_process.exec('appc acs publish --list_versions', function (error, stdout, stderr) {

            if (error !== null) {
                return grunt.fail.fatal(error);
            }

            var matches = stdout.match(REGEXP_VERSIONS);

            if (matches === null) {
                return done();
            }

            var all = matches[1].split(', ');
            var deployed = matches[2];

            if (all.length === 1) {
                return done();
            }

            async.each(all, function (version, callback) {

                if (version === deployed) {
                    return callback();
                }

                grunt.log.write('Unpublishing: ' + version);
                child_process.exec('appc acs unpublish --ver ' + version, callback);

            }, done);
        });
    });

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
};