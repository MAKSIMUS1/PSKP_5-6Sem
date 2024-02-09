const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 5000, host:'localhost', path: '/broadcast'});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN)    client.send('server: '+ message);
        });
    })
    ws.on('close', () => {console.log('wss socket closed');})
});