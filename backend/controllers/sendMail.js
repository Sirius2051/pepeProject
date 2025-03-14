const transporter = require('../config/mail');

const sendMail = async (to, subject, text) => {
    const mailOption = {
        from: 'avilejosealejandro@gmail.com',
        to: to,
        subject: subject,
        html: text
    }
    try {
        await transporter.sendMail(mailOption);
        // response.status(200).send('Correo enviado')
    } catch (error) {
        console.log(error)
        // response.status(500).send('Correo no enviado')
    }
}

module.exports = {sendMail}