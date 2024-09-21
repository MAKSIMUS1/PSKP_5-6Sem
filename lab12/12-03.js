const redis =  require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379/'} );

client.on('ready', () => { console.log('ready'); });
client.on('error', (err) => { console.log('error: ', err); });
client.on('connect', () => { console.log('connect'); });
client.on('end', () => { console.log('end'); });


(async () => {
    await client.connect();
    
    await client.set('incr', 0);
    
    const startTimeIncr = performance.now();

    for(let n = 0; n < 10000; n++) {
        await client.incr('incr');
    }
    
    const endTimeIncr = performance.now();
    const executionTimeIncr = endTimeIncr - startTimeIncr;
    console.log(`Incr Execution time: ${executionTimeIncr} milliseconds`);
    
    const startTimeDecr = performance.now();

    for(let n = 0; n < 10000; n++) {
        await client.decr('incr');
    }
    
    const endTimeDecr = performance.now();
    const executionTimeDecr = endTimeDecr - startTimeDecr;
    console.log(`Decr Execution time: ${executionTimeDecr} milliseconds`);
    
    await client.quit();
})();

