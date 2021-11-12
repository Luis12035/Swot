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
        "to": to,
        "from": process.env.MAIL_USER,
        "subject": subject,
        "html": body
    }

    mailTransport.sendMail(mailOptions, (err, info)=>{
        if (err) {
            console.log(err);
        }else{
            console.log(`Email Sent: ${info.response}`);
        }
    });
}

module.exports = mailerSender;