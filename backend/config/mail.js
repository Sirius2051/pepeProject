const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'avilejosealejandro@gmail.com',
        pass: 'tpvl yodo jhjd trcr'
    }
});

transporter.verify((error) => {
    if (error) console.log("Error en transporter:", error);
    else console.log("Transporter listo para enviar emails");
});

module.exports = transporter;