let http = require('http');

http.createServer(function(request, response) {
    let result = '';
    request.on('data', (data)=>{result+=data;})
    request.on('end', ()=>{
        let obj = JSON.parse(result);
        console.log(obj);
        response.end(JSON.stringify(obj));
    });
}).listen(5000);

console.log('Server running at http://localhost:5000/');

//--------- client ------------------------
let jsonm = JSON.stringify({x:1, y:2, s:'sss'});
let options = {
    host:'localhost',
    path: '/',
    port: 5000,
    method: 'POST',
    headers: {
        'content-type':'application/json', 'accept':'application/json'
    }
}
const req = http.request(options, (res) => {
    console.log('http.request: response: ', res.statusCode);

    let data = '';
    res.on('data', (chunk) => { data += chunk.toString('utf8'); });
    res.on('end', () => { 
        console.log('http.response: end: body = ', data);
        console.log('http.response: end: parse(body) =', JSON.parse(data)); 
    });
});

req.on('error', (e) => { console.log('http.request: error: ', e.message); });
req.end(jsonm);