const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    res.end('Hello World!');

    const extension = path.extname(req.url);

    let contentType;
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.html':
            contentType = 'text/html';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/plain';
            break;
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

/* myEmitter.on('log', (message) => logEvents(message, 'log.txt'));

setTimeout(() => {
    myEmitter.emit('log', 'Log event emitted!');
}, 2000); */
