const net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

net.createServer((sock)=>{
    console.log('Server CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', (data)=>{
        console.log('Server DATA:', sock.remoteAddress + ': ' + data);
        sock.write('ECHO:' + data);
    });

    sock.on('close', ()=>{console.log('Ser CLOSED: ', sock.remoteAddress+ ' '+sock.remotePort);});
}).listen(PORT, HOST);

console.log('TCP-сервер ' + HOST + ':' + PORT);