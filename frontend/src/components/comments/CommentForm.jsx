"use client"

import { useState } from "react"
import Button from "../auth/Button"

const CommentForm = ({ postID, onCommentAdded }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) return

    setLoading(true)

    // Obtener el ID del usuario del localStorage
    const userID = localStorage.getItem("userId") || 1 // Valor por defecto para pruebas

    try {
      const response = await fetch("http://localhost:3456/api/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          userID,
          postID,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setContent("")
        if (onCommentAdded) {
          onCommentAdded(data.comment)
        }
      } else {
        alert(data.error || "Error al crear el comentario")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Escribe un comentario..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button text={loading ? "Enviando..." : "Comentar"} color="primary" disabled={loading || !content.trim()} />
      </div>
    </form>
  )
}

export default CommentForm

