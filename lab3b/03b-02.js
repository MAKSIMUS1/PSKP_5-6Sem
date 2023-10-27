const secondJob = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("Error");
        }, 3000);
    });
}


secondJob()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });


const test = async () => {
    try{
        const res = await secondJob();
        console.log(res);
    }
    catch(error) {
        console.log(error);
    }
}

test();