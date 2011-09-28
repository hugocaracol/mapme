
var socket = io.connect('http://localhost:3000');
socket.emit('join_room',{ room: 'localhost', type:'client' });

