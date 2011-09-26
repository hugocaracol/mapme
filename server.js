
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

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/about', function(req,res){
	res.render('about',{
		title:'About me'
	})
});

app.get('/shorten', function(req,res){
	console.log('faking url shortening...');
	var result = shortener.shorten(req.param('key'));
	res.send(result);
});


app.listen(3000);


io.sockets.on('connection', function(socket){
	var address = socket.handshake.address;
	console.log("New connection from " + address.address + ":" + address.port);

/*
	var gObj = ipinfodb.ip2geo('178.166.70.205',function(gObj){
				console.log("Country: " + gObj.country);
				console.log("Lat: " + gObj.latitude);
				console.log("Long: " + gObj.longitude);
				socket.broadcast.emit('location',gObj);
				socket.emit('location',gObj);
			});
*/
	var gObj = {country: 'Portugal', latitude:Math.floor(Math.random()*37), longitude:-1*Math.floor(Math.random()*122)};
	socket.emit('location',gObj);
	socket.broadcast.emit('location',gObj);

	socket.on('disconnect', function(){
		socket.broadcast.emit('disconnected',gObj);
	});
	

	socket.on('my other event', function(data){
		console.log(data);
	});
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);








