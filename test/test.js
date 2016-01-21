var assert = require('assert');
var util = require('util');
var bunyan = require('bunyan');
var PrettyStream = require('../index');

var orginalConsoleLog = console.log;

var validBunyanLevels = {
    '10': 'trace',
    '20': 'debug',
    '30': 'info',
    '40': 'warn',
    '50': 'error',
    '60': 'fatal'
};

describe('Pretty Stream', function () {
    describe('write', function () {
        it('should throw if the argument is not a string', function (done) {
            var prettyStream = new PrettyStream();

            assert.throws(function () {
                prettyStream.write({});
            });

            done();
        });

        it('should work with bunyan', function (done) {
            var prettyStream = new PrettyStream();

            var log = bunyan.createLogger({
                name: 'test logger',
                streams: [
                    {
                        level: 'info',
                        stream: prettyStream
                    }
                ]
            })
            

            var loggerText = 'Hello Logger!';
            var containsMessage = false;
            
            // Intercept console.log to make sure bunyan is printing our pretty stream to stdout
            console.log = function(format, date, level, msg) {
                containsMessage = msg.indexOf(loggerText) !== -1
            }

            log.info('Hello Logger!');
            
            // Restore console.log
            console.log = orginalConsoleLog;
            
            assert(containsMessage, 'console.log does not contain a message with the logger text');
            
            done();
        })
    });

    describe('createLogArguments', function () {
        it('should create four log arguments (format, date, level, message) for non-error logs', function (done) {
            var logObj = '{"name":"myapp","hostname":"banana.local","pid":40161,"level":30,"msg":"hi","time":"2013-01-04T18:46:23.851Z","v":0}'
            var prettyStream = new PrettyStream();
            var prettyArgs = prettyStream.createLogArguments(logObj);

            assert.equal(prettyArgs.length, 4);

            var consoleLogFormat = prettyArgs[0];
            assert(consoleLogFormat);

            var date = prettyArgs[1];
            assert(Date.parse(date));

            var level = prettyArgs[2];
            assert(getKeyByValue(validBunyanLevels, level.toLowerCase()));

            var msg = prettyArgs[3];
            assert(msg);

            done();
        });




        it('should create five log arguments (format, date, level, errorMessage, stack) for error logs', function (done) {
            var logObjErr = {
                "name": "myapp",
                "hostname": "banana.local",
                "pid": 40161,
                "level": 30,
                "msg": "hi",
                "err": {
                    "message": "boom",
                    "name": "TypeError", "stack": "TypeError: boom\n    at Object.<anonymous>\n"
                },
                "time": "2013-01-04T18:46:23.851Z",
                "v": 0
            }
            var logObjErrStr = JSON.stringify(logObjErr);
            var prettyStream = new PrettyStream();
            var prettyArgs = prettyStream.createLogArguments(logObjErrStr);

            assert(prettyArgs, 'Failed build argument array from log object');
            assert.equal(prettyArgs.length, 5);

            var consoleLogFormat = prettyArgs[0];
            assert(consoleLogFormat);

            var date = prettyArgs[1];
            assert(Date.parse(date));

            var level = prettyArgs[2];
            assert(getKeyByValue(validBunyanLevels, level.toLowerCase()));

            var msg = prettyArgs[3];
            assert(msg);

            var stack = prettyArgs[4];
            assert(stack);

            done();
        });
    })

    describe('constructor', function () {
        it('should set levels parameter to match the bunyan api', function (done) {
            var prettyStream = new PrettyStream();

            assert(prettyStream.levels);
			
            // If this fails then the bunyan levels API has changed.
            assert.equal(JSON.stringify(validBunyanLevels), JSON.stringify(prettyStream.levels));

            done();
        });
    })
});

function getKeyByValue(obj, value) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === value)
                return prop;
        }
    }

    return undefined;
}
