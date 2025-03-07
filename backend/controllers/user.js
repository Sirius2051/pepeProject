const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');
const SECRET_KEY = 'tu_secreto_aqui'; // Asegúrate de mantener este secreto seguro

// Registro de usuarios
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username: email, password: hashedPassword });
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
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
            res.cookie('token', token, {httpOnly: true, path: '/'})
            res.json({ token, userId: user.id });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Olvido de contraseña
router.post('/forgot-password', (req, res) => {
    res.send('Funcionalidad no implementada');
});

// Cambio de contraseña
router.post('/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (user && await bcrypt.compare(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            res.json({ message: 'Contraseña cambiada exitosamente' });
        } else {
            res.status(401).json({ error: 'Contraseña antigua incorrecta' });
        }
    } catch (error) {
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
