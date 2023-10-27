const square = (data) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if(typeof data === 'number'){
            let sq = data*data;
            resolve(`result of square(${data}) = ${sq}`);
        }else{
            reject('Error: not number');
        }
    }, 1500);
});

const cube = (data) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if(typeof data === 'number'){
            let sq = data*data*data;
            resolve(`result of cube(${data}) = ${sq}`);
        }else{
            reject('Error: not number');
        }
    }, 500);
});

const fourth = (data) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if(typeof data === 'number'){
            let sq = data*data*data*data;
            resolve(`result of fourth(${data}) = ${sq}`);
        }else{
            reject('Error: not number');
        }
    }, 1000);
});

Promise.race([square(2), cube(2), fourth(2)])
    .then((data) => {
    console.log('success: ', data);
}).catch((error) => {
    console.log('error: ', error);
});

Promise.any([square(2), cube(2), fourth(2)])
    .then((data) => {
    console.log('success: ', data);
}).catch((error) => {
    console.log('error: ', error);
});
//-------
Promise.race([square(2), cube(true), fourth(2)])
.then((data) => {
console.log('success: ', data);
}).catch((error) => {
console.log('error: ', error);
});

Promise.any([square(2), cube(true), fourth(2)])
.then((data) => {
console.log('success: ', data);
}).catch((error) => {
console.log('error: ', error);
});