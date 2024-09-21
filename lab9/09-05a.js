const rpcWSC = WebSocket = require('rpc-websockets').Client
let ws = new rpcWSC('ws://localhost:4000/');

ws.on('open', ()=>{
    ws.call('square', [3]).then((r)=>{console.log('square = ', r);});
    ws.call('square', [5, 4]).then((r)=>{console.log('square = ', r);});
    ws.call('sum', [2]).then((r)=>{console.log('sum = ', r);});
    ws.call('sum', [2,4,6,8,10]).then((r)=>{console.log('sum = ', r);});
    ws.call('mul', [2]).then((r)=>{console.log('mul = ', r);});
    ws.call('mul', [3,5,7,9,11,13]).then((r)=>{console.log('mul = ', r);});
    ws.login({login:'kmo', password:'123'})
    .then((login)=>{
        if(login){
            ws.call('fib', [1]).then((r)=>{console.log('fib = ', r);});
            ws.call('fib', [2]).then((r)=>{console.log('fib = ', r);});
            ws.call('fib', [7]).then((r)=>{console.log('fib = ', r);});
            
            ws.call('fact', [0]).then((r)=>{console.log('fact = ', r);});
            ws.call('fact', [5]).then((r)=>{console.log('fact = ', r);});
            ws.call('fact', [10]).then((r)=>{console.log('fact = ', r);});
        }
        else console.log('login error');
    })
    .catch((e)=>{console.log('login failed: ', e.message)});
});
ws.on('error', (e) => {console.log('error = ', e)});
