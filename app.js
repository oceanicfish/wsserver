var http = require('http');
var sockjs = require('sockjs');

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
var clients = [];

echo.on('connection', function(conn) {
    clients[conn.id] = conn;
    console.log('[wsserver] Client ' + conn.id + ' connected.');
    conn.write('[wsserver] Client ' + conn.id + ' connected.');
    conn.on('data', function(message) {
        console.log('[wsserver] Message ' + message);
        if (message == 'console_cmd_play') {
            for(key in clients) {
                if(clients.hasOwnProperty(key)) {
                    console.log('[wsserver] Sending message [' + message + '] to ' + clients[key]);
                    clients[key].write('cmd_play');
                }
            }
        }
    });
    conn.on('close', function() {
        delete clients[conn.id];
    });
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/tv'});
server.listen(9999, '0.0.0.0');