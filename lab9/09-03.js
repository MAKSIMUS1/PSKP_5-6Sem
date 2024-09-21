const WebSocket = require('ws');
const wss = new WebSocket.Server({port:4000, host:'localhost'});

let n = 1;
let activeClient = 0;
wss.on('connection',(ws)=>
{
    ws.on('pong', data =>{activeClient+=parseInt(data, 10);});

    setInterval(() =>{
        wss.clients.forEach(client =>{ client.ping(1); });
        console.log('Active: ' + (activeClient));
        activeClient = 0;
    }, 5000);

    setInterval(()=>{
        wss.clients.forEach((client)=>
        {
            if(client.readyState === WebSocket.OPEN){ client.send('09-03-server:' + n++); }
        });
    }, 15000);
});