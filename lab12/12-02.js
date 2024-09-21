const redis =  require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379/'} );

client.on('ready', () => { console.log('ready'); });
client.on('error', (err) => { console.log('error: ', err); });
client.on('connect', () => { console.log('connect'); });
client.on('end', () => { console.log('end'); });


(async () => {
    await client.connect();
    
    const startTimeSet = performance.now();
    
    for(let n = 0; n < 10000; n++) {
        await client.set(String(n), `set${n}`);
    }
    
    const endTimeSet = performance.now();
    const executionTimeSet = endTimeSet - startTimeSet;
    console.log(`Set Execution time: ${executionTimeSet} milliseconds`);
    
    const startTimeGet = performance.now();
    
    for(let n = 0; n < 10000; n++) {
        await client.get(String(n));
    }
    
    const endTimeGet = performance.now();
    const executionTimeGet = endTimeGet - startTimeGet;
    console.log(`Get Execution time: ${executionTimeGet} milliseconds`);
    
    const startTimeDel = performance.now();
    
    for(let n = 0; n < 10000; n++) {
        await client.del(String(n));
    }
    
    const endTimeDel = performance.now();
    const executionTimeDel = endTimeDel - startTimeDel;
    console.log(`Del Execution time: ${executionTimeDel} milliseconds`);
    
    await client.quit();
})();
