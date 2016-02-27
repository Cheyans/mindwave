var neurosky = require('node-neurosky');
var WebSocketServer = require('ws').Server;

var client = neurosky.createClient({
	appName:'NodeNeuroSky',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})

current_tick = 0;
tick = 5;
attention = [];
meditation = [];

// bind receive data event
client.on('data',function(data){
  // if websocket server is running
  if(wss){
    // broadcast this latest data packet to all connected clients
    wss.broadcast(data);
  }
  //var high_alpha = [];
  //var low_alpha = [];
  


  //console.log("whoops");
  if(data.poorSignalLevel < 25 && data.eSense.attention > 0 
    && data.eSense.meditation > 0){
    current_tick++;
    attention.push(data.eSense.attention);
    meditation.push(data.eSense.meditation);
    if(current_tick % tick == 0){
      //find average 
      var med_sum = 0;  
      for(var data : meditation)
        med_sum += data.meditation;
      var atten_sum = 0;  
      for(var data : attention)
        atten_sum += data.attention;
      
      var med_avg = med_sum/tick;
      var atten_avg = med_sum/tick;

      attention = [];
      meditation = [];

      //then push results to a command on the device
      console.log("average meditation was"+ med_avg);
      console.log("average attention was"+ atten_avg);
    }

    }

});
// initiate connection
client.connect();
/** END connect to neurosky **/

/** BEGIN start our websocket server **/
// start websocket server to broadcast
var wss = new WebSocketServer({port: 8080});

// broadcast function (broadcasts message to all clients)
wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

// bind each connection
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
      //filter out any bad data

      console.log('[CLIENT]  %s', message);
    });
    ws.send('You are connected to Mindwave Mobile');
});
