var http = require('http');

function getGeoInfo(res){
        //OK;;74.125.45.100;US;UNITED STATES;CALIFORNIA;MOUNTAIN VIEW;94043;37.3956;-122.076;-08:00
        var fields = res.split(";");
        return { success: true, "country": fields[4],"latitude":fields[8],"longitude":fields[9]};
}

function ip2geo(ip,callback) {
	var url = "api.ipinfodb.com"
    var site = http.createClient(80, url);
    site.on('error', function(err) {
        sys.debug('unable to connect to ' + url);
    });

    var request = site.request('GET', '/v3/ip-city/?key=20b96dca8b9a5d37b0355e9461c66e76eed30a2274422fa6213d9de6ffb2b34e&ip='+ip, {'host': url});
    request.end();
    request.on('response', function(res) {
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
			var jsonObj = getGeoInfo(chunk);
			callback(jsonObj);
			return jsonObj;
		  });
    });
}

exports.ip2geo = ip2geo;
