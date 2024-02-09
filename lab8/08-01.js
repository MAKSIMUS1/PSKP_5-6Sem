const httpserver = require('http').createServer((req, res)=>{
    if(req.method == 'GET' && req.url == '/start'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(require('fs').readFileSync('./0801.html'));
    }else{
        res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
        res.end();
    }
});
httpserver.listen(3000);
console.log('ws server: 3000');

let k = 0;
const WebSocket = require('ws');
const wsserver = new WebSocket.Server({ port: 4000,host:'localhost', path:'/wsserver'})
wsserver.on('connection', (ws) => {
    let n = -1;
    ws.on('message', message => {
        n = message; 
        console.log(`08-01-client: ${message}`)
    })
    setInterval(() => {ws.send(`08-01-server: ${n}->${++k}`)}, 5000);
})
wsserver.on('error',(e)=>{console.log('ws server error', e)});
console.log(`ws server: host:${wsserver.options.host}, port:${wsserver.options.port}, path:${wsserver.options.path}`);