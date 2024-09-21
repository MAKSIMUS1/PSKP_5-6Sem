const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');


ws.on('ping', (data) =>{
    console.log('pong');
    ws.ping(1);
})
.on('error', (e)=> {console.log('WS-server error ', e);});
ws.onmessage = (e) => {console.log("Message server: ", e.data);};