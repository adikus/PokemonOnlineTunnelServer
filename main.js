var http = require('http');
var net = require('net');
var dataBuffer = [];
var client;
var fs = require('fs'),
fstream = fs.createWriteStream("mains.data");

client = net.connect({port: 5080, host:'188.165.249.120'},
function() { //'connect' listener
	console.log('connected to PO server\n');
});

client.on('data', function(data) {
	dataBuffer.push(data);
    //console.log('Data stored in buffer.\n');
});

client.on('end', function() {
	console.log('Server disconnected.\n');
});

http.createServer(function (request, response) {
	 
    if(request.headers['content-length'] > 0)console.log('content-length: '+request.headers['content-length']);
    
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var data = dataBuffer.shift();
    if(data){
        console.log('\nPO server --> Tunnel server');
        //console.log(data.toString('utf8'));
    }
    response.end(data);    
    
    request.on('data', function(chunk) {		
		console.log('\nTunnel server --> PO server');
		//console.log(chunk.toString('utf8'));
		client.write(chunk);
		//fstream.write(chunk);
    });
    /*
    request.on('end', function() {
    	console.log('request ending...');
    });*/
     
}).listen(process.env.PORT || 80);
 
//Put a friendly message on the terminal of the server.
console.log('Tunnel server running at port '+(process.env.PORT || 80));