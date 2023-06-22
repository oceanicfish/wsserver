// var http = require('http');
var https = require('https');
var fs = require('fs');
var sockjs = require('sockjs');

const DEBUG = false;
const PLAYER_PREFIX = 'PLAYER_PREFIX';
const SERVER_PREFIX = 'SERVER_PREFIX';
const CONSOLE_PREFIX = 'console_';

var ws = sockjs.createServer({ sockjs_url: 'https://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
var clients = [];

ws.on('connection', function(conn) {
    clients[conn.id] = conn;
    DEBUG && console.log('[wsserver] Client ' + conn.id + ' connected.');
    conn.write('[wsserver] Client ' + conn.id + ' connected.');
    conn.on('data', function(message) {
        DEBUG && console.log('[wsserver] Message ' + message);
        if (message.startsWith(CONSOLE_PREFIX)) {
            for(key in clients) {
                if(clients.hasOwnProperty(key)) {
                    DEBUG && console.log('[wsserver] Sending message [' + message + '] to ' + clients[key]);
                    clients[key].write(message.substring(CONSOLE_PREFIX.length));
                }
            }
        }
        if (message.startsWith(PLAYER_PREFIX)){
            for(key in clients) {
                if(clients.hasOwnProperty(key)) {
                    DEBUG && console.log('[wsserver] Sending message [' + message.substring(PLAYER_PREFIX.length) + '] to ' + clients[key]);
                    clients[key].write(SERVER_PREFIX + message.substring(PLAYER_PREFIX.length));
                }
            }
        }
    });
    conn.on('close', function() {
        delete clients[conn.id];
    });
});

// var server = http.createServer();
var options = {
    cert: fs.readFileSync('/etc/ssl/certificate.crt'),
    key: fs.readFileSync('/etc/ssl/private/private.key')
};
var server = https.createServer(options);
ws.installHandlers(server, {prefix:'/tv'});
server.listen(9999, '0.0.0.0');