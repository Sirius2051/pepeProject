const speakeasy = require('speakeasy');
const { User } = require('../models');
const transporter = require('./sendMail');
const { where } = require('sequelize');
const { sendMail } = require('./sendMail');


const sendVerificationCode = async (email) => {
    const secret = speakeasy.generateSecret({ length: 10 });
    const token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    })
    await User.update({secret: secret.base32, token}, { where: {username: email}});


    sendMail(email, 'Tu codigo de verificacion es', `
        <h1>Tu codigo de verificacion es:</h1>

        ${token}
        `)
}

const verifyCode = async (email, token) => {
    const user = User.findOne({ where: { username: email} })

    if (!user) {
        return false;
    }

    const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: token,
        window: 10
    })
    return verified;
}
module.exports = { sendVerificationCode, verifyCode }