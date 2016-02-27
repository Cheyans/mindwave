var WebSocketServer = require('ws').Server;

var wssIncome = new WebSocketServer({
	port: 6112
})

var wssOutgoing = new WebSocketServer({
  port: 6113
})

wssIncome.on('connection', function connection(ws) {
  wssIncome.on('message', function incoming(message) {
    console.log(message);
    wssOutgoing.send(message);
  });
});
