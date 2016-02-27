var neurosky = require('node-neurosky');
var WebSocketServer = require('ws').Server;

var client = neurosky.createClient({
  appName: 'NodeNeuroSky',
  appKey: '0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})

var mindwaveWSS = new WebSocketServer({
  port: 8080
});

var remoteWSS = new WebSocketServer({
	port: 8000
})

client.connect();
current_tick = 5.0;
highAlphaDivider = 30000;
highAlphas = [];

// bind receive data event
client.on('data', function(data) {
  // if websocket server is running
	if(data.poorSignalLevel) {
		console.log("Signal Strength: " + parseInt(data.poorSignalLevel));
	} else if (data.blinkStrength) {
		console.log(data);
	} else if (data.poorSignalLevel < 25 && data.eSense.attention > 0 && data.eSense.meditation > 0) {
    current_tick++;
    highAlphas.push(data.eegPower.highAlpha);
    if (current_tick % tick == 0) {
      //find average
      var hAlphaSum = 0;
			highAlphas.forEach(function(val) {
        hAlphaSum += val;
      });
      var hAlphaAvg = hAlpha_sum / tick;

      //then push results to a command on the device
      console.log("Avg hAlphaAvg: " + parseInt(hAlphaAvg));
			remoteWSS.broadcast(hAlphaAvg < highAlphaDivider ? 0 : 1);
			//empty array
			attention = [];
			meditation = [];
    }
  }
});

// broadcast function (broadcasts message to all clients)
remoteWSS.broadcast = function (data) {
	console.log("broadcasting");
  mindwaveWSS.clients.forEach(function each(client) {
    client.send(data);
  });
};
