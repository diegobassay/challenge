var fs = require('fs');

var debug = function(obj) {
	
	var out = '';

	for (var i in obj) {
		
		if((typeof obj[i] != 'function') && i.substring( 0, 1 ) != '_'){


			out += i + ": " + obj[i] + "\n";

		}
		
	}

	return out;
}


exports.accessLog = function(request, objInspect) {

	var path = "./log/access_log.log";

	var now = new Date();

	var dateAndTime = now.toLocaleDateString() +" "+ now.toLocaleTimeString();
	
	var out = '';

	stream = fs.createWriteStream(path, {
		'flags': 'a+',
		'encoding': 'utf8',
		'mode': 0644
	});

	out += dateAndTime + " ";

	if(request != null){

		out += request.connection.remoteAddress + ": ";

		out += request.method + " ";

		out += request.url + "\n";

	}else{

		out += "\n";

	}

	if(objInspect != null){

		out += "---------------------------------------------------\n";
		out += debug(objInspect);
		out += "---------------------------------------------------\n";

	}
	
	console.log(out);
	
	stream.write(out);

	stream.end();
}
