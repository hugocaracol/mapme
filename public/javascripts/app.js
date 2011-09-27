var map;
var markersArray = [];
var locationsArray = [];

function initialize() {
	var latlng = new google.maps.LatLng(0, 0);
	var myOptions = {
		zoom: 2,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("map_canvas"),
    myOptions);
}

function removeMarker(gObj){
	for(i=0;i<locationsArray.length;i++){
		if(locationsArray[i].latitude == gObj.latitude && locationsArray[i].longitude == gObj.longitude){
			markersArray[i].setMap(null); //removes the marker from the map
			break;
		}
	}
}

$(function(){
	$('#source').focus();

	var shorten = function(){
		$.ajax({
			url: 'shorten',
			data: { key: $('#source').val() },
			type: 'GET',
			success: function(json){
				$('#source').val(json.key);
			}
		});
	}


	$('#btShorten').click(function(){
		shorten();
	});
	
	var socket = io.connect('http://hugocaracol.no.de');
	socket.on('location',function(location){
		var latlong = new google.maps.LatLng(location.latitude,location.longitude);

		var image = new google.maps.MarkerImage(
			'images/yellow_dot.png',
			new google.maps.Size(12,12),
			new google.maps.Point(0,0),
			new google.maps.Point(6,12)
		);
		var shape = {
		  coord: [6,0,9,1,10,2,10,3,10,4,11,5,11,6,11,7,10,8,9,9,8,10,7,11,5,11,2,10,2,9,1,8,1,7,0,6,1,5,1,4,1,3,2,2,3,1,4,0,6,0],
		  type: 'poly'
		};

		var marker = new google.maps.Marker({
			position:latlong,
			icon: image,
			shape: shape,
			title:location.country
		});
		marker.setMap(map);
		markersArray.push(marker);
		locationsArray.push(location);
		$('#connected').append(location.country+'<br/>');
//		socket.emit('my other event',{ my: 'data' });
	});
	socket.on('disconnected',function(gObj){
		removeMarker(gObj);
		//$('#connected').append(data.msg+'<br/>');
	});
	initialize();
});


