const express = require("express")
const router = express.Router()
const { Comment, User, Post } = require("../models")
// const authMiddleware = require('../middlewares/auth')
const {sendMail} = require('./sendMail')
// 📌 Crear un comentario
router.post("/create", async (req, res) => {
  const { content, userID, postID } = req.body

  try {
    // Verificar que el post existe
    const post = await Post.findByPk(postID)
    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada" })
    }

    // Crear el comentario
    const comment = await Comment.create({
      content,
      userID,
      postID,
    })
      console.log(post.userId)
    const user = await User.findByPk(post.userID);
    const userC = await User.findByPk(userID);
    sendMail(user.username, 'Hay un nuevo comentario en tu publicación', `
        <h1>${userC.username} comentó:</h1>\
        <p>
          ${content}
        </p>
      `)
    // Obtener el comentario con datos del usuario para devolverlo
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: {
        model: User,
        attributes: ["id", "username", "name", "lastName", "profileImg"],
      },
    })

    res.status(201).json({
      message: "Comentario creado exitosamente",
      comment: commentWithUser,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al crear el comentario" })
  }
})

// 📌 Obtener todos los comentarios de una publicación
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params

  try {
    const comments = await Comment.findAll({
      where: { postID: postId },
      include: {
        model: User,
        attributes: ["id", "username", "name", "lastName", "profileImg"],
      },
      order: [["createdAt", "ASC"]], // Ordenar por fecha de creación (más antiguos primero)
    })

    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener los comentarios" })
  }
})

// 📌 Obtener un comentario específico
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const comment = await Comment.findByPk(id, {
      include: {
        model: User,
        attributes: ["id", "username", "name", "lastName", "profileImg"],
      },
    })

    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" })
    }

    res.json(comment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener el comentario" })
  }
})

// 📌 Actualizar un comentario
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { content } = req.body

  try {
    const comment = await Comment.findByPk(id)

    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" })
    }

    // Verificar que el usuario que actualiza es el propietario del comentario
    if (req.body.userID && comment.userID !== Number.parseInt(req.body.userID)) {
      return res.status(403).json({ error: "No tienes permiso para editar este comentario" })
    }

    // Actualizar el comentario
    comment.content = content
    await comment.save()

    res.json({
      message: "Comentario actualizado exitosamente",
      comment,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al actualizar el comentario" })
  }
})

// 📌 Eliminar un comentario
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const comment = await Comment.findByPk(id)

    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" })
    }

    // Verificar que el usuario que elimina es el propietario del comentario
    if (req.body.userID && comment.userID !== Number.parseInt(req.body.userID)) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" })
    }

    await comment.destroy()

    res.json({ message: "Comentario eliminado exitosamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al eliminar el comentario" })
  }
})

// 📌 Obtener todos los comentarios de un usuario
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params

  try {
    const comments = await Comment.findAll({
      where: { userID: userId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "name", "lastName", "profileImg"],
        },
        {
          model: Post,
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener los comentarios del usuario" })
  }
})

module.exports = router

