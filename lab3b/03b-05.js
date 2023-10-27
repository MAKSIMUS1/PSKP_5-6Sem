const square = (data) => new Promise((resolve, reject) => {
        if(typeof data === 'number'){
            let sq = data*data;
            resolve(`result of square(${data}) = ${sq}`);
        }else{
            reject('Error: not number');
        }
});

const cube = (data) => new Promise((resolve, reject) => {
        if(typeof data === 'number'){
            let sq = data*data*data;
            resolve(`result of cube(${data}) = ${sq}`);
        }else{
            reject('Error: not number');
        }
});

const fourth = (data) => new Promise((resolve, reject) => {
        if(typeof data === 'number'){
            let sq = data*data*data*data;
            resolve(`result of fourth(${data}) = ${sq}`);
        }else{
            reject('Error: not number');
        }
});

Promise.all([square(2), cube(2), fourth(2)])
    .then((data) => {
    console.log('success: ', data);
}).catch((error) => {
    console.log('error: ', error);
})

Promise.all([square(true), cube(2), fourth(2)])
    .then((data) => {
    console.log('success: ', data);
}).catch((error) => {
    console.log('error: ', error);
})