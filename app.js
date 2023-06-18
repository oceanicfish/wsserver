// var http = require('http');
var https = require('https');
var fs = require('fs');
var sockjs = require('sockjs');

const DEBUG = false;

var ws = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
var clients = [];

ws.on('connection', function(conn) {
    clients[conn.id] = conn;
    DEBUG && console.log('[wsserver] Client ' + conn.id + ' connected.');
    conn.write('[wsserver] Client ' + conn.id + ' connected.');
    conn.on('data', function(message) {
        DEBUG && console.log('[wsserver] Message ' + message);
        if (message == 'console_cmd_play') {
            for(key in clients) {
                if(clients.hasOwnProperty(key)) {
                    DEBUG && console.log('[wsserver] Sending message [' + message + '] to ' + clients[key]);
                    clients[key].write('cmd_play');
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
    cert: fs.readFileSync('/etc/pki/tls/certs/apache-selfsigned.crt'),
    key: fs.readFileSync('/etc/pki/tls/private/apache-selfsigned.key')
};
var server = https.createServer(options);
ws.installHandlers(server, {prefix:'/tv'});
server.listen(9999, '0.0.0.0');