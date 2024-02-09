const WebSocket = require('ws');

let parm0 = process.argv[0];    // path node
let parm1 = process.argv[1];    // path application
let parm2 = process.argv[2];    // first parameter

console.log('parm2 = ', parm2);

let prfx = typeof parm2 == 'undefined' ? 'A' : parm2;
const ws = new WebSocket('ws://localhost:5000/broadcast');
ws.on('open', ()=>{
    let k = 0;
    setInterval(()=>{
        ws.send(`client: ${prfx}-${++k}`); // send message to server
    }, 1000);

    ws.on('message', message => {
        console.log(`Received message => ${message}`);
    })

    setTimeout(()=>{ws.close()},25000);
});