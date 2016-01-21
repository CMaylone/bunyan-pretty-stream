/* ************************************************** *
 * ******************** Pretty prints a bunyan stream to console (now with 100% more color)
 * ************************************************** */

var util = require('util'),
    bunyan = require('bunyan');

var PrettyStream = function (options) {
    if (!options) options = {};

    this.colors = require('colors');

    // Set a color scheme that correlates with each of the logging levels.
    // TODO Allow this to be user defined
    this.colors.setTheme(options.theme || {
        success: 'green',
        info: 'cyan',
        trace: 'gray',
        debug: 'magenta',
        warn: 'yellow',
        error: 'red'
    });

    // Logging levels. These correlate directly with how the bunyan logging library defines its logging levels.
    // https://github.com/trentm/node-bunyan#levels
    this.levels = bunyan.nameFromLevel;
};

// Inherit from writable stream.
util.inherits(PrettyStream, require('stream').Writable);

PrettyStream.prototype.write = function (obj) {
    var logArguments = this.createLogArguments(obj);
    console.log.apply(console, logArguments);
};

PrettyStream.prototype.createLogArguments = function (obj, callback) {
    // Parse the passed string to JSON.
    if (typeof obj === 'string') {
        try {
            var logRecord = JSON.parse(obj);
        } catch (e) {
            console.log('Failed to parse log object as JSON \n %s', e);
            return undefined;
        }
    } else {
        throw new Error('Unexpected log record type. Make sure that the bunyan stream type is set to \'stream\'');
    }

    // Get friendly text version of the log level
    var level = this.levels[logRecord.level];

    // Use log record to get appropriate color for the log
    var color = this.colors[level];

    // Store arguments that will be passed into console.log
    var logArguments = [];

    // Base format string that will be passed into console.log
    logArguments[0] = '[%s] ' + color('[%s]') + ': ' + color('%s');

    if (logRecord.err) {
        // Update format string to include a template for the error stack
        logArguments[0] = logArguments[0] + '\n' + color('%s');

        logArguments = logArguments.concat([
            new Date(logRecord.time).toUTCString(),
            level.toUpperCase(),
            logRecord.err.message,
            logRecord.err.stack
        ]);
    } else {
        logArguments = logArguments.concat([
            new Date(logRecord.time).toUTCString(),
            level.toUpperCase(),
            logRecord.msg
        ]);
    }

    return logArguments;
}


/* ************************************************** *
 * ******************** Exports
 * ************************************************** */

module.exports = PrettyStream;