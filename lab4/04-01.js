const http  = require('http');
const url   = require('url');
const fs    = require('fs');
let data    = require('./DB.js');

let db = new data.DB();
// --- слушатели событий ----------------
db.on('GET', (request, response) => {
    console.log('DB.GET');
    response.end(JSON.stringify(db.select()));
});

db.on('POST', (request, response) => {
    console.log('DB.POST');
    request.on('data', data => {
        let r = JSON.parse(data);
        console.log(r);
        response.end(JSON.stringify(db.insert(r)));
    })
});

db.on('PUT', (request, response) => {
    console.log('DB.PUT');
    request.on('data', data => {
        let r = JSON.parse(data);
        console.log(r);
        response.end(JSON.stringify(db.update(r)));
    })
});

db.on('DELETE', (request, response) => {
    console.log('DB.DELETE');
    request.on('data', data => {
        let r = JSON.parse(data);
        console.log(r);
        response.end(JSON.stringify(db.delete(r)));
    })
});

http.createServer((request, response) =>{

    if(url.parse(request.url).pathname === '/'){
        let html = fs.readFileSync('./04-02.html');
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8' });
        response.end(html);
    }
    else if(url.parse(request.url).pathname === '/api/db'){
        let flag = false;
        let param = url.parse(request.url, true).query.id;
        if(typeof param != 'undefined'){
            let id = parseInt(param);
            if(Number.isInteger(id)){
                flag = true;
                db.delete({id:id});
                response.end(JSON.stringify(db.select()));
            }
        }
        if(!flag){ db.emit(request.method, request, response); }
    }
}).listen(5000);