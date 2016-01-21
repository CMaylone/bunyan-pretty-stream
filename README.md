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
