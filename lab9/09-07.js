const rpcWSS = require('rpc-websockets').Server
let server = new rpcWSS({port:4000, host:'localhost'});

server.register('A', ()=>{
    console.log('notify A')
}).public();
server.register('B', ()=>{
    console.log('notify B')
}).public();
server.register('C', ()=>{
    console.log('notify C')
}).public();