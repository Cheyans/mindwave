var express       = require('express');
var bodyParser    = require('body-parser');
var app           = express();
var port          = process.env.PORT || 3000;
var handlebars = require('express-handlebars');

var http = require('http');
var neurosky = require('node-neurosky');
var WebSocketServer = require('ws').Server;
var flash = require('connect-flash');
var session = require('express-session');

app.use(flash());
app.set('port', process.env.PORT || 3000);
var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(session({
 secret: 'octocat',
 // Both of the options below are deprecated, but should be false
 // until removed from the library - sometimes, the reality of
 // libraries can be rather annoying!
 saveUninitialized: false, // does not save uninitialized session.
 resave: false             // does not save session if not modified.
}));

var client = neurosky.createClient({
  appName: 'NodeNeuroSky',
  appKey: '0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})

var mindwaveWSS = new WebSocketServer({
  port: 8080
});

var remoteWSS = new WebSocketServer({
  port: 6112
})

client.connect();
current_tick = 0;
tick = 5.0;
highAlphaDivider = 30000;
highAlphas = [];
globalData = {};

// bind receive data event
client.on('data', function(data) {
  // if websocket server is running
  if (data.poorSignalLevel || data.poorSignalLevel == 0) {
    console.log("Signal Strength: " + parseInt(data.poorSignalLevel));
    console.log(data.eSense.attention);
    console.log(data.eSense.meditation);
  } else if (data.blinkStrength) {
    console.log(data);
  }

  if (data.poorSignalLevel < 25 && data.eSense.attention > 0 && data.eSense.meditation > 0) {
    current_tick++;
    console.log("Current tick" + parseInt(current_tick % tick));
    highAlphas.push(data.eegPower.highAlpha);
    console.log(highAlphas);
    if (current_tick % tick == 0) {
      //find average
      var hAlphaSum = 0;
      for (var val in highAlphas) {
        hAlphaSum += val;
      }
      // highAlphas.forEach(function(val) {
      // });
      var hAlphaAvg = hAlphaSum / tick;

      //then push results to a command on the device
      console.log("Avg hAlphaAvg: " + parseInt(hAlphaAvg));
      highAlphas = [];
      globalData = hAlphaAvg < highAlphaDivider ? 0 : 1;

      //empty array
    }
  }
});

// broadcast function (broadcasts message to all clients)
// var broadcast = function(data) {
//   var querystring = require('querystring');
//
//   var options = {
//     host: '162.243.204.56',
//     port: 6112,
//     path: '/mindwave',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Content-Length': Buffer.byteLength(data)
//     }
//   };
//
//   var req = http.request(options, function(res) {
//     res.setEncoding('utf8');
//     res.on('data', function(chunk) {
//       console.log("body: " + chunk);
//     });
//   });
//
//   req.write(data);
//   req.end();
// }

app.get('/something', (req, res)=>{
 console.log("GlobalData: " + parseInt(globalData));
 res.render('something', globalData, (err, html) => {
   if(err) console.log(err);
 })
 //req.flash('something', globalData);
});

app.listen(app.get('port'), () => {
 console.log('Express application started on http://localhost:' +
             app.get('port') + '; press Ctrl-C to terminate');
});
