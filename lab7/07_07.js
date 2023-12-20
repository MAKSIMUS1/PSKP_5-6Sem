const http = require('http');
const fs = require('fs');

http.createServer(function(request, response) {
    const fileStream = fs.createReadStream('MyFile.png');

    fileStream.on('open', () => {
        response.setHeader('Content-Type', 'image/png');
        fileStream.pipe(response);
    });

    fileStream.on('error', (err) => {
        console.error('Ошибка при чтении файла:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    });
}).listen(5000);

//--------- client ------------------------
const file = fs.createWriteStream("file.png");

let options = {
    host: 'localhost',
    path: '/myfile',
    port: 5000,
    nethod: 'GET'
}

const req = http.request(options, (res) => {res.pipe(file); });
req.on('error', (e) => { console.log('http.request: error:', e.message); });
req.end();