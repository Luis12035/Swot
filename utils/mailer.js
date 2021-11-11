//Libreria para el mailer
const nodemailer = require('nodemailer');

//configurarmos el transporte
const mailTransport = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    }
);

const mailerSender = (to, subject, body) =>{
    const mailOptions = {
        "from": 'process.env.MAIL_USER',
        "to": to,
        "subject": subject,
        "text": body
    }

    mailTransport.sendMail(mailOptions, (err, info)=>{
        if (err) {
            console.log(err);
        }else{
            console.log(`Email Sent: ${info.response}`);
        }
    });
}

module.exports = mailerSender();