const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');
const SECRET_KEY = 'tu_secreto_aqui'; // Asegúrate de mantener este secreto seguro
const {sendMail} = require('./sendMail');
const{ sendVerificationCode, verifyCode } = require('./2fa');
const { use } = require('../config/mail');

const origin = process.env.ORIGIN;


// Registro de usuarios
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username: email, password: hashedPassword });
        sendMail(email, 'Bienvenido a PEPE', `
            <h1>Gracias por unirte a nuestra comunidad</h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt inventore quaerat ipsa perferendis! Reprehenderit quibusdam tempore ad perferendis nostrum distinctio dignissimos, consequatur officiis excepturi rem, dolorem suscipit? Nobis commodi facilis optio aliquid fugit saepe deleniti, nesciunt aliquam est accusantium obcaecati perspiciatis provident numquam esse illum laboriosam delectus quia. Odio quod, voluptates nisi modi officia veniam cum iure. Magni odio iure quos hic velit accusamus vitae? Maxime eius nam natus recusandae? Delectus magni quis, voluptatibus aliquam recusandae praesentium molestiae laborum et mollitia. Voluptatem quod veritatis explicabo nam itaque saepe praesentium, alias ipsa doloremque ab obcaecati ex optio culpa dicta maxime eos!</p>
            `)
        res.status(201).json({message: "Registro exitoso"});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Inicio de sesión de usuarios
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { username: email } });
        if (user && await bcrypt.compare(password, user.password)) {
            sendVerificationCode(email);
            res.json({ userId: user.id });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});


router.post('/verify-code', async (request, response) => {
    const { code, userID } = request.body;
    const user = await User.findByPk(userID);
    console.log(code, userID)
    console.log(user)
    try {
        
        if (code != user.token) {
            console.log(verified)
            return false;
        }
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        response.cookie('token', token, {httpOnly: true, path: '/'})
        response.json({ userId: user.id });

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Error al verificar codigo' });

    }



})

// Olvido de contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { username: email } });
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    sendMail(email, 'Cambiar contraseña', `
        Presione el enlace para cambiar contraseña

        <a href="${origin}/change-password/${token}">Cambiar</a>
        `)
    res.send('Correo enviado');
});

router.post('/verify-token', async (request, response) => {
    const { token } = request.body;

    jwt.verify(token, SECRET_KEY, (error, user) => {
        if (error) {
            return response.status(403).send("No puedes ver esto, autenticacion fallida");  
        }
        response.status(200).send({
            user: user,
            verifyStatus: true
        });
        // request.user = user;
    })


})

// Cambio de contraseña
router.post('/change-password', async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        const user = await User.findByPk(userId);
        // if (user && await bcrypt.compare(oldPassword, user.password)) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Contraseña cambiada exitosamente' });
        // } else {
        //     res.status(401).json({ error: 'Contraseña antigua incorrecta' });
        // }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
});

// Editar perfil
router.post('/edit-profile', async (req, res) => {
    const { userId, username } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            user.username = username;
            await user.save();
            res.json({ message: 'Perfil actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
});

// Cierre de sesión
router.post('/logout', (req, res) => {

    res.json({ message: 'Cierre de sesión exitoso' });
});

module.exports = router;
