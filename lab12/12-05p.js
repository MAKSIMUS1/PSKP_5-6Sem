const redis =  require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379/'} );

(async () => {
    await client.connect();
    setTimeout(async () => { await client.publish('channel1', 'message 1'); }, 1000);
    setInterval(async () => { await client.publish('channel2', 'message X'); }, 2000).unref();
    setTimeout(async () => { await client.publish('channel3', 'message 3'); }, 3000);
    setTimeout(async () => { await client.publish('channel4', 'message 4'); }, 7000);
    
    setTimeout(async () => { await client.quit(); }, 15000);

    client.on('end', () => {console.log('end'); });
})();