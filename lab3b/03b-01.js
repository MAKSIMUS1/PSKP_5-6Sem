function firstJob(){
    return new Promise((resolve, reject) => {  
        setTimeout(() => {
            resolve("Hello world!");
        }, 2000)
    }); 
}


firstJob()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });


const test = async () => {
    try{
        const res = await firstJob();
        console.log(res);
    }
    catch(error) {
        console.log(error);
    }
}

test();