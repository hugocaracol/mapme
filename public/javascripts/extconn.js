var mapOnline = {

	connect: function (roomName){

		$.getJSON('http://jsonip.appspot.com', function(data) {
			//var socket = io.connect('http://localhost:3000');
			var socket = io.connect('http://hugocaracol.no.de');
			socket.emit('join_room',{ room: roomName, type:'client', ip: data.ip });
		});
	}
};

mapOnline.connect('localhost');


