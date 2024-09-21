const udp = require('dgram');

const client = udp.createSocket('udp4');

const PORT = 3000;

const message = 'Hello';

client.on('message', (msg) => {
    console.log(`Получено от сервера: ${msg}`);
    client.close();
});

client.send(message, PORT, 'localhost', (err) => {
    if (err) {
        client.close();
    } else {
        console.log(`Сообщение отправлено: ${message}`);
    }
});



client.on('error', (err) => {
    console.error(`UDP client error: ${err.message}`);
});