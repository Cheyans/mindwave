var express = require('express');
var nodeThinkGear = require('node-thinkgear');


var app = express();






app.use(express.static(__dirname));
 


var tgClient = nodeThinkGear.createClient({
	appName: 'Mind Wave interceptor',
	appKey: 'ip'
});



tgClient.on('data', function(data){
	//add something here
	


});





app.listen(1337);