const thirdJob = (data) => {
   
        return new Promise((resolve, reject) => {
            if(typeof data === 'number'){
                if(data % 2 == 0) { 
                    setTimeout(() => {
                        reject("even");
                    }, 2000)
                }
                else{ 
                    setTimeout(() => {
                        resolve("odd");
                    }, 1000)
                }
            }
            else {
                reject("Error");
            }
        });   
}


thirdJob('gg')
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
    
thirdJob(20)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });


const test = async () => {
    try{
        const res = await thirdJob(15);
        console.log(res);
    }
    catch(error) {
        console.log(error);
    }
}

test();