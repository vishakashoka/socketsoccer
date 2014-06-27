// Create file-system, http and socket IO objects
var fs = require('fs')
    , http = require('http')
    , socketio = require('/usr/local/share/npm/lib/node_modules/socket.io');

// Instantiate a http server to receive your web connections
var server = http.createServer(function(req, res) {
    // Respond client with the web-page designed for client. 
    // This page handles the web socket messages sent from 
    // server and also sends back to server
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/simpleGame.html'));
});

// Server listens on a specific port number
server.listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});

var name = 'vishak';

// Listen to socket events on the http server
socketio.listen(server).on('connection', function (socket) {

    var socketZ = {

        handleClientMessage: function(msg) {
          console.log('Message Received : '+msg+socket.id);
          socket.broadcast.emit('ack-message', "Server received msg : "+msg);
        },

        handleClientAckMessage: function(amsg) {
          console.log('ask-message Received: ', msg);
        },

        handleClientDisconnect: function(e) {
          console.log('Client got disconnected');
        },

        handleClientConnect: function(e) {
          console.log('Client got connected');
        },

        sendCustomEventAndMsg: function(eName, msg) {
          eName = ''+eName;
          msg = ''+msg;
          socket.broadcast.emit(eName, msg);
        }
    }

    // Received a 'message' from client and send an 'ack-message' back
    socket.on('message', socketZ.handleClientMessage);

    // Received a 'ack-message' from client
    socket.on('ack-message', socketZ.handleClientAckMessage);

    // Send a custom event to the client
    socketZ.sendCustomEventAndMsg('ign-hack-event', "Custom event msg");

    // Client got 'disconnected'
    socket.on('disconnect', socketZ.handleClientDisconnect);

    // Client got 'connected'
    socket.on('connect', socketZ.handleClientConnect);
    
});