const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
let parseString = require('xml2js').parseString;
let xmlbuilder = require('xmlbuilder');
let m0600 = require('./m0600');
const path = require('path');
let mp = require('multiparty');

let h = (r) => {
    let rc = '';
    for (key in r.headers) rc += '<h3>' + key + ':' + r.headers[key] + '</h3>';
    return rc;
}
let calcXmlResult = (obj) => {
    let rc = '<result>parse error</result>';
    try{
        let sum = 0;
        let concat = '';
        obj.request.x.forEach(element => {
            sum += parseInt(element.$.value);
        });
        obj.request.m.forEach(element => {
            concat = concat.concat(element.$.value);
        });
        console.log(obj.request.x);
        console.log(obj.request.m);
        let xmldoc = xmlbuilder.create('response').att('id', 33).att('request', obj.request.$.id);
        xmldoc.ele('sum').att('element', 'x').att('result', sum);
        xmldoc.ele('concat').att('element', 'm').att('result', concat);
        rc = xmldoc.toString({pretty:true});
    }catch(e){console.log(e);}
    return rc
}

let k = 0;
let c = 0;
let s = '';

let server = http.createServer();

let http_handler = (request, response) => {
    if (request.method == 'GET') {
        if (url.parse(request.url).pathname === '/connection') {

            let param = url.parse(request.url, true).query.set;
            if (typeof param != 'undefined') {
                let set = parseInt(param);
                if (Number.isInteger(set)) {
                    server.keepAliveTimeout = set;
                    response.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    response.end('<h1> KeepAliveTimeout = ' + set + '</h1>');
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    response.end('<h1> KeepAliveTimeout error </h1>');
                }
            } else {
                response.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                });
                response.end('<h1> KeepAliveTimeout = ' + server.keepAliveTimeout + '</h1>');
            }
        } else if (url.parse(request.url).pathname === '/headers') {
            response.setHeader('jjj', 'hhh');
            let a = response.getHeaders();
            let rc = '';
            for (key in a) rc += '<h3>' + key + ':' + a[key] + '</h3>';
            response.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            response.end(
                '<h2> HEADERS request: </h2>' +
                h(request) +
                '<h2> HEADERS response: </h2>' +
                rc);
        } else if (url.parse(request.url).pathname === '/parameter') {

            let param_x = url.parse(request.url, true).query.x;
            let param_y = url.parse(request.url, true).query.y;
            if (typeof param_x != 'undefined' && typeof param_y != 'undefined') {
                let x = parseInt(param_x);
                let y = parseInt(param_y);
                if (Number.isInteger(x) && Number.isInteger(y)) {
                    response.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    response.end(
                        `<h1> x = ${x} </h1>` +
                        `<h1> y = ${y} </h1>` + 
                        `<h1> x + y = ${(x + y)} </h1>` + 
                        `<h1> x - y = ${(x - y)} </h1>` + 
                        `<h1> x * y = ${(x * y)} </h1>` + 
                        `<h1> x / y = ${(x / y)} </h1>` 
                    );
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    response.end('<h1> error x y </h1>');
                }
            } else {
                response.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                });
                response.end('<h1> error x y </h1>');
            }
        } else if (url.parse(request.url).pathname.startsWith('/parameter/')) {

            let p = url.parse(request.url, true);
            let result = '';
            result = `pathname: ${p.pathname}<br/>`;
            decodeURI(p.pathname).split('/').forEach(e => {
                result += `${e}<br/>`
            });
            
            if (typeof decodeURI(p.pathname).split('/')[2] != 'undefined' 
                && typeof decodeURI(p.pathname).split('/')[3] != 'undefined') {
                let x = parseInt(decodeURI(p.pathname).split('/')[2]);
                let y = parseInt(decodeURI(p.pathname).split('/')[3]);
                if (Number.isInteger(x) && Number.isInteger(y)) {
                    response.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    response.end(
                        `<h1> x = ${x} </h1>` +
                        `<h1> y = ${y} </h1>` + 
                        `<h1> x + y = ${(x + y)} </h1>` + 
                        `<h1> x - y = ${(x - y)} </h1>` + 
                        `<h1> x * y = ${(x * y)} </h1>` + 
                        `<h1> x / y = ${(x / y)} </h1>` 
                    );
                } else {
                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    response.end('<h1> URI: '+ request.url +' </h1>');
                }
            } else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end('<h1> URI: '+ request.url +' </h1>');
            }
        } else if (url.parse(request.url).pathname === '/socket') {
            response.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            response.end(
                `<h1> socket.localAddress =  ${request.socket.localAddress} </h1>` +
                `<h1> socket.localPort = ${request.socket.localPort} </h1>` + 
                `<h1> socket.remoteAddress = ${request.socket.remoteAddress} </h1>` + 
                `<h1> socket.remotePort = ${request.socket.remotePort} </h1>`
            );
        } else if (url.parse(request.url).pathname === '/resp-status') {
            let param_c = url.parse(request.url, true).query.code;
            let param_m = url.parse(request.url, true).query.mess;
            if (typeof param_c != 'undefined' && typeof param_m != 'undefined') {
                let c = parseInt(param_c);
                if (Number.isInteger(c)) {
                    response.writeHead(c, param_m, {'Content-Type': 'text/html; charset=utf-8'});
                    response.end(
                        `<h2> status code: ${c} </h2>` + 
                        `<h2> mess: ${param_m} </h2>`
                        );
                } else {
                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    response.end('<h1> error in params </h1>');
                }
            } else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end('<h1> error in params </h1>');
            }
        } else if (url.parse(request.url).pathname === '/formparameter') {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('./formparameter.html'));
        } else if (url.parse(request.url).pathname === '/files') {
            let n = 0;
            files = fs.readdirSync('./static', (err, files) => {
            });
            n = files.length;
            response.setHeader('X-static-files-count', n);
            let a = response.getHeaders();
            let rc = '';
            for (key in a) rc += '<h3>' + key + ':' + a[key] + '</h3>';
            response.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            response.end(
                '<h2> HEADERS response: </h2>' +
                rc);
        } else if (url.parse(request.url).pathname.startsWith('/files/')) {

            let p = url.parse(request.url, true);
            if (typeof decodeURI(p.pathname).split('/')[2] != 'undefined') {
                let file = decodeURI(p.pathname).split('/')[2];
                const filePath = path.join(__dirname, 'static', file);
                try {
                    const fileContent = fs.readFileSync(filePath);
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end(fileContent);
                } catch (err) {
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.end('Error 404: File Not Found');
                }
            } else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end('<h1> URI: '+ request.url +' </h1>');
            }
        } else if (url.parse(request.url).pathname === '/upload') {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('./upload.html'));
        }
    } else if (request.method == 'POST') {
        if (url.parse(request.url).pathname === '/formparameter') {
            let result = '';
            request.on('data', (data)=>{result+=data;})
            request.on('end', ()=>{
                result += '<br/>';
                let o = qs.parse(result);
                for(let key in o) {result += `${key} = ${o[key]}<br />`}
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<h1>URL-params</h1>');
                response.end(result);
            })
        } else if (url.parse(request.url).pathname === '/json') {
            let result = '';
            request.on('data', (data)=>{result += data;})
            request.on('end', ()=>{
                try{
                    let obj = JSON.parse(result);
                    console.log(obj.m);
                    let s_o = obj.s.concat(": ", obj.o.surname, ", ", obj.o.name);
                    response.end(JSON.stringify(
                        {
                            __comment:"Response", 
                            x_plus_y:(obj.x+obj.y),
                            Concationation_s_o: s_o,
                            Length_m: (obj.m.length)
                        }
                    ));
                }
                catch(e){
                    console.log(e.code);
                }
            })
        } else if (url.parse(request.url).pathname === '/xml') {
            let xmltxt = '';
            let obj = null;
            request.on('data', (data)=>{xmltxt += data;})
            request.on('end', ()=>{
                parseString(xmltxt, function (err, result){
                    if(err) m0600.write400(response, 'xml parse error');
                    else m0600.write200(response, 'ok xml', calcXmlResult(result));
                })
            });
        } else if (url.parse(request.url).pathname === '/upload') {
            let result = '';
            //request.on('data', (data)=>{result+=data;})
            //request.on('end', ()=>{});
            let form = new mp.Form({uploadDir:'./static'});
            form.on('field', (name, value)=>{
                console.log('----- field -----------');
                console.log(name, value);
                result += `<br />---${name} = ${value}`;
            });
            form.on('file', (name, file)=>{
                console.log('----- file ------------');
                console.log(name, file);
                result += `<br />---${name} = ${file.originalFilename}: ${file.path}`;
            });
            form.on('error', (err)=>{
                console.log('----- err -------------');
                console.log('err =', err);
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<h1>Form/Error</h1>');
                response.end();
            });
            form.on('close', ()=>{
                console.log('----- close -------------');
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write('<h1>Form</h1>');
                response.end(result);
            });
            form.parse(request);
        }
    } else {
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end('for other http-method not so');
    }
};

server.on('request', http_handler);

server.listen(5000, (v) => {
        console.log('server.listen(5000)')
    })
    .on('error', (e) => {
        console.log('server.listen(5000): error: ', e.code)
    })