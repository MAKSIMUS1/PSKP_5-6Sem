const http = require('http');
const fs = require('fs');

http.createServer(function (request, response) {
    if(request.url === '/api/name') {
        fs.readFile('03.txt', (err, data)=>
        {
            response.writeHead(200, {'Content-Type': 'text/plain'})
            response.end(data);
        })
    }
    if(request.url === '/xmlhttprequest')
    {
        fs.stat('xmlhttprequest.html', (err, stat)=>
            {
                let html = fs.readFileSync('xmlhttprequest.html');
                response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                response.end(html);
            }
        )
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/xmlhttprequest');