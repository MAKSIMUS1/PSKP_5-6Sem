let http = require('http');
let query = require('querystring');
let url = require('url');

http.createServer(function(request, response) {
    let p = url.parse(request.url, true);
    let result = '';
    let q = url.parse(request.url, true).query;
    for(key in q) { result+=`${key} = ${q[key]}<br/>`;}
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.write('<h1>GET-параметры</h1>');
    response.end(result);
}).listen(5000);

console.log('Server running at http://localhost:5000/');

//--------- client ------------------------
let parms = query.stringify({x:3, y:4});
let path = `/mypath?${parms}`

console.log('parms', parms);
console.log('path', path);

let options = {
    host:'localhost',
    path: path,
    port: 5000,
    method: 'GET'
}
const req = http.request(options, (res) => {
    console.log('http.request: response: ', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        console.log('http.request: data: body = ', data += chunk.toString('utf8'));
    });
    res.on('end', () => { console.log('http.request: end: body =', data); });

});

req.on('error', (e) => { console.log('http.request: error: ', e.message); });
req.end();