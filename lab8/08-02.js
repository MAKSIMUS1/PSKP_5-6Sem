const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000/wsserver');

let k = 0;
ws.onopen = () => {
    console.log('ws.onopen');
    setTimeout(()=>{ws.close()},25000);
    setInterval(()=>{ws.send(++k);}, 3000);
};
ws.onclose = (e) => { console.log('ws.onclose', e);};
ws.onmessage = (e) => {console.log('ws.onmessage', e.data)};
ws.onerror = function(error) {alert("Ошибка " + error.message);};