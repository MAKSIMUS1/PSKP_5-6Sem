const WebSocket = require('ws');
const wss = new WebSocket.Server({port:4000, host:'localhost'});
wss.on('connection', (ws)=>{
    let x = '';
    let n = 0;
    ws.on('message', (data)=>{
        console.log('on message: ', JSON.parse(data));
        x = (JSON.parse(data)).client;
    });
    setInterval(()=>{ws.send(JSON.stringify({server:++n, client:x, timestamp:new Date().toISOString()}));}, 1000);
});