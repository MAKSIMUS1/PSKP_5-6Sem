const udp = require('dgram');

const server = udp.createSocket('udp4');

const PORT = 3000; // Выберите порт по вашему усмотрению

server.on('error', (err) => {
    console.log(`Ошибка: ${err.message}`);
    server.close();
});

server.on('message', (msg, info) => {
    console.log('Server: от клиента получено: ' + msg.toString());
    const message = `ECHO: ${msg}`;
    server.send(message, info.port, info.address, (err) => {
        if (err) {
            server.close();
        } else {
            console.log(`Письмо полетело к ${info.address}:${info.port}: ${message}`);
        }
    });
});

server.on('listening', () => {
    console.log(`Server: слушает порт ${server.address().port}`);
    console.log(`Server: ip сервера ${server.address().address}`);
    console.log(`Server: семейство(IP4/IP6) ${server.address().family}`);
});



server.bind(PORT);