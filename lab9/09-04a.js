const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');
let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 'A' : parm;
ws.on('open',()=>{
    ws.on('message', data => {console.log('on message: ', JSON.parse(data));});
    setInterval(()=>{ws.send(JSON.stringify({client:prfx, timestamp: new Date().toISOString()}));}, 1000);
});