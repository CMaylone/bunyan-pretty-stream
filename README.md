*Deprecated* Recommend using [node-bunyan-stream](https://github.com/mrrama/node-bunyan-prettystream) instead.

[![Build Status](https://travis-ci.org/CMaylone/bunyan-pretty-stream.svg?branch=master)](https://travis-ci.org/CMaylone/bunyan-pretty-stream)

# bunyan-pretty-stream
Pretty prints bunyan logs to stdout

# Usage
```bash
npm install bunyan-pretty-stream
```

```javascript
var bunyan = require('bunyan'),
    PrettyStream = require('bunyan-pretty-stream');

var log = bunyan.createLogger({
    name: 'test logger',
    streams: [
        {
            level: 'info',
            stream: new PrettyStream()
        }
    ]
})
```
