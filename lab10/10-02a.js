const net = require('net');

const HOST = '127.0.0.1';
const PORT = process.argv[2]?process.argv[2]:40000;
const X = process.argv[3]?parseInt(process.argv[3]):1;
let client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log(X);
    console.log('Client CONNECTED: ', client.remoteAddress + ':' + client.remotePort);
    setInterval(() => {
        const buf = Buffer.alloc(4);
        buf.writeInt32LE(X, 0);
        client.write(buf);
    }, 1000);
});

client.on('data', (data) => {
     const sum = data.readInt32LE();
    console.log(`Получил от сервера: ${sum}`);
});


client.on('close', () => {
    console.log('Client CLOSE');
});

client.on('error', (e) => {
    console.log('Client ERROR');
});