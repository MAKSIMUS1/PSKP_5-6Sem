var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end();
}).listen(5000);

console.log('Server running at http://localhost:5000/');

//--------- client ------------------------


let options = {
    host:'localhost',
    path:'/mypath',
    port: 5000,
    method: 'GET'
}
const req = http.request(options, (res) => {

    console.log('http.request: method = ', req.method);
    console.log('http.request: response: ', res.statusCode);
    console.log('http.request: statusMessage:', res.statusMessage);
    console.log('http.request: socket.remoteAddress:', res.socket.remoteAddress);
    console.log('http.request: res.socket.remotePort:', res.socket.remotePort);
    console.log('http.request: res.headers:', res.headers);

    let data = 'dfdsfsdf';
    res.on('data', (chunk) => {
        console.log('http.request: data: body = ', data += chunk.toString('utf8'));
    });
    res.on('end', () => { console.log('http.request: end: body =', data); });

});

req.on('error', (e) => { console.log('http.request: error: ', e.message); });
req.end();