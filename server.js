
/**
 * Module dependencies.
 */

var express = require('express'), shortener = require('./shortener');
var url = require('url');
var sys = require('sys');

var app = module.exports = express.createServer();
var io = require('socket.io');
var io = io.listen(app);
var ipinfodb = require('./ipinfodb');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

io.configure(function() {
	io.set("transports", ["xhr-polling", "flashsocket", "json-polling"]);
});


// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'users online'
  });
});

app.get('/about', function(req,res){
	res.render('about',{
		title:'Client page'
	})
});

app.get('/shorten', function(req,res){
	console.log('faking url shortening...');
	var result = shortener.shorten(req.param('key'));
	res.send(result);
});


app.listen(process.env.PORT || 3000);


io.sockets.on('connection', function(socket){
	var address = socket.handshake.address;
	var room;
	var gObj;

	console.log("New connection from " + address.address + ":" + address.port);

	
	socket.on('join_room', function(room_to_join){
		//joins socket to a room
		room = room_to_join;
		socket.join(room.room+'_'+room.type);
		console.log(room.ip+" joined room: "+room.room+'_'+room.type);
		if(room.type == 'client'){
			//gObj = {country: 'Portugal', latitude:Math.floor(Math.random()*37), longitude:-1*Math.floor(Math.random()*122)};
				var gObj = ipinfodb.ip2geo(room.ip,function(gObj){
							console.log("Country: " + gObj.country);
							console.log("Lat: " + gObj.latitude);
							console.log("Long: " + gObj.longitude);
							console.log("Long: " + gObj.longitude);

							socket.broadcast.to(room.room+'_world').emit('location',gObj);
							console.log('location was broadcasted to room: ' + room.room + '_world');

						});
		}
			

	});


	socket.on('disconnect', function(){
		//check wich type of user left the room. if its a world_room user, it does nothing. otherwise...
		socket.leave("/"+room.room+'_'+room.type);
		console.log("Leaving room: " + room.room+' Type:'+room.type);
		if(room.type == 'client'){
			socket.broadcast.to(room.room+'_world').emit('disconnected',gObj);
			console.log("user disconnected");
		}
//		console.log("user disconnected from room:" + room.room + ". sending obj...");
	});


	socket.on('my other event', function(data){
		console.log(data);
	});
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);








