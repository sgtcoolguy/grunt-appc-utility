# grunt-appc-utility WIP
> A Grunt utility plugin (for Arrow apps) that contains commonly used methods and exposes other Grunt plugins.

## Getting Started
This plugin requires Grunt `~1.0.0`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-appc-utility --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-appc-utility');
```

## Overview
This plugin is not your typical Grunt plugin. Its main purpose is to centralize all commonly used methods and other Grunt plugins into one "parent" plugin. This will help reduce repeated Grunt-code in our Arrow app repos that depend on Grunt.

Other Grunt plugins exposed in this utility:
* [grunt-appc-js](https://github.com/appcelerator-modules/grunt-appc-js)
* [grunt-appc-istanbul](https://github.com/appcelerator/grunt-appc-istanbul)

### API
#### unpublish

Since there is a max amount of times you can publish your Arrow app, this task will indiscriminately unpublish all of your Arrow versions **except** for the last deployed version.

###### Example
```js
module.exports = function (grunt) {

    ...

    // NOTE: no configuration is needed in grunt.initConfig for this task
    grunt.registerTask('make_room', ['unpublish']);
};
```
---

#### ssl

Generate a .pem file using the specified certificates and/or key files.

###### Example
```js
module.exports = function (grunt) {

    ...

    grunt.initConfig({
        ssl: {
            foo: {
                src: [
                    'conf/software.appcelerator.com.crt',
                    'conf/gd_intermediate.crt',
                    'conf/software.appcelerator.com.key',
                ],
                dest: 'build/software.appcelerator.com.pem'
            }
        }
    });

    ...

    grunt.registerTask('make_pem', ['ssl']);
};
```

##### Required Target Properties

###### src
Type: `Array`

An array of string paths to your list of certificates/keys.

**Note:** The order in which you specify your certificates/keys matter when generating your `.pem` file:

* http://serverfault.com/questions/476576/how-to-combine-various-certificates-into-single-pem
* https://www.digicert.com/ssl-support/pem-ssl-creation.htm

Specifying the order is left to the user's discretion.

###### dest
Type: `String`

File path to generate your `.pem` file. `.pem` extension is required.

---

TODO: list defaults from tasks/other_plugins.js

TODO: list links used in other_plugins.js; they will contains more usage information