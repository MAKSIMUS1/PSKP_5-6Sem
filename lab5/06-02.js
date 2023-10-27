const http  = require('http');
const url   = require('url');
const fs    = require('fs');
const { parse } = require('querystring');
const send = require('./m06_KMO_local/m06_KMO');

let http_handler = (req, resp) => {
    resp.writeHead(200, {'Content-Type': 'text/html; charsetutf-8'});
    if(url.parse(req.url).pathname == '/' && req.method == 'GET'){
        resp.end(fs.readFileSync('./index.html'));
    }else if (url.parse(req.url).pathname == '/' && req.method == 'POST'){
        let body = '';
        req.on('data', chunk => {body += chunk.toString();});
        req.on('end', () => {
            console.log('POST');
            let parm = parse(body);
            send(parm.sender, parm.password, parm.receiver, parm.message);
            resp.end(`<h1>OK: ${parm.receiver}, ${parm.password}, ${parm.sender}, ${parm.message} </h1> `)
        })
    }else if(resp.end('<h1>Not support</h1>'));
}
let server = http.createServer(http_handler);
server.listen(5000);
console.log('Server running at http://localhost:5000/');