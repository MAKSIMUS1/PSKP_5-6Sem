const redis =  require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379/'} );

(async () => {
    const allChannelsSub = client.duplicate();

    await allChannelsSub.connect();

    await allChannelsSub.pSubscribe('channel*', (message, channel) => {
        console.log(`Channel ${channel} sent messsage: ${message}`);
    }, true);

    allChannelsSub.on('error', err => console.error(err));

    setTimeout(async () =>{
        await allChannelsSub.pUnsubscribe();
        await allChannelsSub.quit();
    }, 10000);
})();