var mapOnline = {

	connect: function (roomName){
		var socket = io.connect('http://hugocaracol.no.de');
		socket.emit('join_room',{ room: roomName, type:'client' });
	}
};

mapOnline.connect('localhost');
