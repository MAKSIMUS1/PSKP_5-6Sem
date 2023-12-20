let http = require('http');
let fs = require('fs');
let mp = require('multiparty');

const fileStream = fs.createReadStream('MyFile.png');

http.createServer(function(request, response) {
    const fileStream = fs.createWriteStream('MyFile1.png');
        req.on('data', (chunk) => {
            fileStream.write(chunk);
        });
        req.on('end', () => {
            fileStream.end();
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('All load!');
        });
}).listen(5000);


//--------- client ------------------------
let bound = 'kmo04-kmo04-kmo04';
let body = `--${bound}}\r\n`;
    body += 'Content-Disposition: form-data; name="file"; filename="MyFile.png"\r\n';
    body += 'Content-Type: application/octet-stream\r\n\r\n';

let options = {
    host: 'localhost',
    path: '/mypath',
    port: 5000,
    method: 'POST',
    headers: {'content-type':'multipart/form-data; boundary='+bound}
}
let req = http.request(options, (res) => {

});
req.on('error', (e) => { console.log('http.request: error', e.message);});
req.write(body);

let stream = new fs.ReadStream('MyFile.png');
stream.on('data', (chunk)=>{req.write(chunk); console.log(Buffer.byteLength(chunk))});
stream.on('end', ()=>{req.end(`\r\n--${bound}--\r\n`);});