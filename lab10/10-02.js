const net = require('net');

let HOST = '0.0.0.0';
let PORT1 = 40000;
let PORT2 = 50000;

let h = (n) => {
    let sum = 0;
    return (sock) => {
        console.log(`Connected${n}: ` + sock.remoteAddress + ':' + sock.remotePort);
        sock.on('data', (data) => {
            const number = data.readInt32LE();
            sum += number;
            console.log(`Получил: ${number}, Сумма: ${sum}`);
        });
        setInterval(() => {let buf = Buffer.alloc(4);buf.writeInt32LE(sum, 0);sock.write(buf);}, 5000);
        
        sock.on('close', (err) => {
            console.log(`Closed${n}: ` + sock.remoteAddress + ':' + sock.remotePort);
        });

        sock.on('error', (err) => {});
    }
}

net.createServer(h(PORT1)).listen(PORT1, HOST).on('listening', () => {`TCP-server: ${HOST}:${PORT1}`});
net.createServer(h(PORT2)).listen(PORT2, HOST).on('listening', () => {`TCP-server: ${HOST}:${PORT2}`});