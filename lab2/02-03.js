const http = require('http');
const fs = require("fs");

http.createServer(function(request, response) {
    if(request.url == "/api/name"){
        response.writeHead(200, {'Content-Type': 'text/plain'})
        fs.readFile('03.txt', (error, data) => response.end(data));
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/api/name');