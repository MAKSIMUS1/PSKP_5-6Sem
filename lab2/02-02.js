var http = require('http');
const fs = require("fs");

http.createServer(function(request, response) {
    if(request.url == "/png"){
        fs.readFile("pic.png", (error, data) => response.end(data));
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/png');