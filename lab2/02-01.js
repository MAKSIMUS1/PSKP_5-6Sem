const http = require('http');
const fs = require("fs");

http.createServer(function(request, response) {
    if(request.url == "/html"){
        fs.readFile("index.html", (error, data) => response.end(data));
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/html');