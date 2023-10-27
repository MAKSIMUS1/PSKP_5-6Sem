const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function send(sender, password, receiver, message){
    let transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: sender,
            pass: password
        }
    }));

    var mailOptions = {
        from: sender,
        to: receiver,
        subject: 'Lab5',
        text: message,
        html: `<i>${message}</i>`,
        attachments: [{ filename: 'hqdefault.jpg', path: __dirname + '/hqdefault.jpg', cid: 'img' }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        error ? console.log(error) : console.log('Email sent: ' + info.response);
    })
};

module.exports = send;