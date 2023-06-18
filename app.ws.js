// import { createServer } from 'https';
// import { readFileSync } from 'fs';
// import { WebSocketServer } from 'ws';

var https = require('https');
// var http = require('http');
var fs = require('fs');
var ws = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('/etc/pki/tls/certs/apache-selfsigned.crt'),
  key: fs.readFileSync('/etc/pki/tls/private/apache-selfsigned.key')
});
// const server = https.createServer({
//   cert: fs.readFileSync('keys/fullchain.pem'),
//   key: fs.readFileSync('keys/privkey.pem')
// });
// const server = http.createServer();
const wss = new ws.WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

server.listen(9999);