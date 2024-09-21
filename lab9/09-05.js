const rpcWSS = require('rpc-websockets').Server
let server = new rpcWSS({port:4000, host:'localhost'});

const fibo = (n) => {  
    if (n <= 1) { return n; }
    return fibo(n - 1) + fibo(n - 2); 
};
const fact = (n) => { return (n <= 1 ? 1 : (n * fact(n - 1))); }
server.setAuth((l)=>{return (l.login == 'kmo' && l.password == '123')});

server.register('square', (params) => {
    if(params.length == 1)
    {
        return params[0] * params[0] * 3.14;
    }
    else if(params.length == 2)
    {
        return params[0] * params[1];
    }
    else throw "Error in params";
}).public();
server.register('sum', (params) => {
    let sum = 0;
    for(let i = 0; i < params.length; i++)
    {
        sum += params[i];
    }
    return sum;
}).public();
server.register('mul', (params) => {
    let sum = 1;
    for(let i = 0; i < params.length; i++)
    {
        sum += params[i];
    }
    return sum;
}).public();

server.register('fib', (params) => {return fibo(params[0])}).protected();
server.register('fact', (params) => {return fact(params[0])}).protected();