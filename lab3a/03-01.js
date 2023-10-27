let status = 'norm';
//----------------------------------------------------------------
var http = require('http');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('<h1>' + status + '</h1>\n');
}).listen(5000);

console.log('Server running at http://localhost:5000/');
//----------------------------------------------------------------
process.stdin.setEncoding('utf8');
process.stdout.write(status + ' -> ');
process.stdin.on('readable', () => {
    
    let chunk = null;
    while((chunk = process.stdin.read()) != null){
        if      (chunk.trim() == 'exit')  process.exit(0);
        else if (   chunk.trim() == 'norm' ||
                    chunk.trim() == 'stop' ||
                    chunk.trim() == 'test' ||
                    chunk.trim() == 'idle' )  {
                        process.stdout.write('reg = ' + status + ' --> ' + chunk.trim() +'\n');
                        status = chunk.trim();
                        process.stdout.write(status + ' -> ');
                    }
        else {
            process.stdout.write(chunk);
            process.stdout.write(status + ' -> ');
        }
    }
})