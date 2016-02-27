var neurosky = require('node-neurosky');
var WebSocketServer = require('ws').Server;

var client = neurosky.createClient({
  appName: 'NodeNeuroSky',
  appKey: '0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})

current_tick = 0;
tick = 5;
attention = [];
meditation = [];

// bind receive data event
client.on('data', function(data) {
  // if websocket server is running
	console.log(data);
	// if(data.poorSignalLevel) {
	// 	console.log("Signal Strength: " + parseInt(data.poorSignalLevel));
	// } else if (data.blinkStrength) {
	// 	console.log(data);
	// } else if (data.poorSignalLevel < 25 && data.eSense.attention > 0 && data.eSense.meditation > 0) {
  //   current_tick++;
  //   attention.push(data.eSense.attention);
  //   meditation.push(data.eSense.meditation);
  //   if (current_tick % tick == 0) {
  //     //find average
  //     var med_sum = 0;
  //     meditation.forEach(function(val) {
  //       med_sum += val;
  //     });
  //     var atten_sum = 0;
	// 		attention.forEach(function(val) {
  //       atten_sum += val;
  //     });
  //     var med_avg = med_sum / tick;
  //     var atten_avg = atten_sum / tick;
	//
  //     //then push results to a command on the device
  //     console.log("Avg Med: " + parseInt(med_avg));
  //     console.log("Avg Atten: " + parseInt(atten_avg));
	// 		remoteWSS.broadcast(med_avg);
	// 		//empty array
	// 		attention = [];
	// 		meditation = [];
  //   }
  // }
});

client.connect();

var mindwaveWSS = new WebSocketServer({
  port: 8080
});

var remoteWSS = new WebSocketServer({
	port: 8000
})

// broadcast function (broadcasts message to all clients)
remoteWSS.broadcast = function (data) {
	console.log("broadcasting");
  mindwaveWSS.clients.forEach(function each(client) {
    client.send(data);
  });
};
