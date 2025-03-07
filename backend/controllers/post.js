const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
const upload = require('../config/multer'); // Importa Multer para subir imágenes

// 📌 Crear una publicación con imagen
router.post('/create', upload.single('img'), async (req, res) => {
    const { title, content, userID } = req.body;
    const imgPath = req.file ? req.file.path : null; // Si hay imagen, se guarda su ruta
    console.log("-----------------------------------")
    console.log(userID)
    console.log("-----------------------------------")
    try {
        const post = await Post.create({
            title,
            content,
            img: imgPath,
            userID
        });

        res.status(201).json({ message: 'Publicación creada exitosamente', post });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al crear la publicación' });
    }
});

// 📌 Obtener todas las publicaciones con datos del usuario
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'username', 'name', 'lastName', 'profileImg'] // Datos básicos del usuario
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las publicaciones' });
    }
});

// 📌 Obtener una publicación por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByPk(id, {
            include: {
                model: User,
                attributes: ['id', 'username', 'name', 'lastName', 'profileImg']
            }
        });

        if (!post) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la publicación' });
    }
});

// 📌 Editar una publicación (con opción de cambiar la imagen)
router.put('/:id', upload.single('img'), async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const imgPath = req.file ? req.file.path : null; // Si hay imagen nueva, se guarda su ruta

    try {
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }

        // Actualiza solo los campos que se enviaron
        post.title = title || post.title;
        post.content = content || post.content;
        if (imgPath) post.img = imgPath;

        await post.save();

        res.json({ message: 'Publicación actualizada exitosamente', post });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la publicación' });
    }
});

// 📌 Eliminar una publicación
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }

        await post.destroy();

        res.json({ message: 'Publicación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la publicación' });
    }
});

module.exports = router;
