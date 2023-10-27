let http = require('http');
let query = require('querystring');
let url = require('url');

http.createServer(function(request, response) {
    let result = '';
    request.on('data', (data)=>{result+=data;})
    request.on('end', ()=>{
        result += '<br/>';
        let o = query.parse(result);
        for(let key in o) {result += `${key} = ${o[key]}<br />`}
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.write('<h1>URL-параметры</h1>');
        response.end(result);
    });
}).listen(5000);

console.log('Server running at http://localhost:5000/');

//--------- client ------------------------
let parms = query.stringify({x:3, y:4, s:'xxx'});
console.log('parms', parms);

let options = {
    host:'localhost',
    path: '/mypath',
    port: 5000,
    method: 'POST'
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

req.write(parms);

req.end();