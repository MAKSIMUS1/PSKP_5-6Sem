const redis =  require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379/'} );

client.on('ready', () => { console.log('ready'); });
client.on('error', (err) => { console.log('error: ', err); });
client.on('connect', () => { console.log('connect'); });
client.on('end', () => { console.log('end'); });


(async () => {
    await client.connect();

    await client.set('incr', 0);
    
    const startTimeHset = performance.now();

    for(let n = 0; n < 10000; n++) {
        await client.hSet(String(n), `id:${n}`, `val-${n}`);
    }
    
    const endTimeHset = performance.now();
    const executionTimeHset = endTimeHset - startTimeHset;
    console.log(`HSET Execution time: ${executionTimeHset} milliseconds`);

    const startTimeHget = performance.now();

    for(let n = 0; n < 10000; n++) {
        await client.hGet(String(n), `id:${n}`);
    }
    
    const endTimeHget = performance.now();
    const executionTimeHget = endTimeHget - startTimeHget;
    console.log(`HGET Execution time: ${executionTimeHget} milliseconds`);

    await client.quit();
})();


