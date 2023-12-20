let http = require('http');
let xmlbuilder = require('xmlbuilder');
let parseString = require('xml2js').parseString;
let m0600 = require('../lab6/m0600');

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


http.createServer(function(request, response) {
    let xmltxt = '';
    let obj = null;
    request.on('data', (data)=>{xmltxt += data;})
    request.on('end', ()=>{
        parseString(xmltxt, function (err, result){
            if(err) m0600.write400(response, 'xml parse error');
            else m0600.write200(response, 'ok xml', calcXmlResult(result));
        })
    });
}).listen(5000);

console.log('Server running at http://localhost:5000/');

//--------- client ------------------------
let xmldoc = `
<request id="28">
   <x value = "1"/>
   <x value = "2"/>
   <m value = "na"/>
   <m value = "me"/>
</request>
`;

let options = {
    host:'localhost',
    path: '/',
    port: 5000,
    method: 'POST',
    headers: {
        'content-type':'text/xml', 'accept':'text/xml'
    }
}
const req = http.request(options, (res) => {
    console.log('http.request: response: ', res.statusCode);

    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { 
        console.log('http.response: end: body = ', data);
        parseString(data, (err, str)=>{
            if(err) console.log('xml parse error');
            else{
                console.log('str =', str);
            }
        })
    });
});

req.on('error', (e) => { console.log('http.request: error: ', e.message); });
req.end(xmldoc.toString({pretty:true}));