const { v4: uuidv4 } = require('uuid');

function createOrder(card_number){
    const promise = new Promise((resolve, reject) =>{
        if(!validateCard(card_number)){
            reject('Card is not valid');
            return null;
        }else{
            setTimeout(() => {
                const uuid = uuidv4();
                console.log(`Card number: ${card_number}`);
                proceedToPayment(uuid)
            }, 5000)
        }
    }).then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
} 

function validateCard(card_number){
    var random_boolean = Math.random() < 0.5;
    return random_boolean;
} 

function proceedToPayment(order_number){
    console.log(`Order ID: ${order_number}`);
    const promise = new Promise((resolve, reject) =>{
        var random_boolean = Math.random() < 0.5;
        if(!random_boolean){
            resolve('Payment successfull');
        }else{
            reject('Payment failed');
        }
    }).then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
} 

const test = async () => {
    try {
        await createOrder('1234 5678 9123 4567');
    }
    catch(error) {
        console.log(error);
    }
}

test();


createOrder('8888 8888 8888 8888');