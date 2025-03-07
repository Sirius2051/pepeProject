"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const CommentItem = ({ comment, onCommentDeleted, onCommentUpdated }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [loading, setLoading] = useState(false)

  // Formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Verificar si el usuario actual es el autor del comentario
  const isAuthor = () => {
    const currentUserId = localStorage.getItem("userId")
    return currentUserId && Number.parseInt(currentUserId) === comment.userID
  }

  // Manejar la actualización del comentario
  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false)
      setEditContent(comment.content)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3456/api/comments/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
          userID: comment.userID,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEditing(false)
        if (onCommentUpdated) {
          onCommentUpdated({
            ...comment,
            content: editContent,
          })
        }
      } else {
        alert(data.error || "Error al actualizar el comentario")
        setEditContent(comment.content)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al conectar con el servidor")
      setEditContent(comment.content)
    } finally {
      setLoading(false)
    }
  }

  // Manejar la eliminación del comentario
  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3456/api/comments/${comment.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: comment.userID,
        }),
      })

      if (response.ok) {
        if (onCommentDeleted) {
          onCommentDeleted(comment.id)
        }
      } else {
        const data = await response.json()
        alert(data.error || "Error al eliminar el comentario")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex mb-3">
      <div className="me-2">
        {comment.User?.profileImg ? (
          <img
            src={comment.User.profileImg || "/placeholder.svg"}
            alt={comment.User?.username}
            className="rounded-circle"
            style={{ width: "32px", height: "32px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
            style={{ width: "32px", height: "32px" }}
          >
            {comment.User?.name?.charAt(0) || "U"}
          </div>
        )}
      </div>
      <div className="flex-grow-1">
        <div className="bg-light p-2 rounded">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div>
              <Link to={`/profile/${comment.User?.id}`} className="fw-bold text-decoration-none">
                {comment.User?.name} {comment.User?.lastName}
              </Link>
              <small className="text-muted ms-2">@{comment.User?.username}</small>
            </div>
            <small className="text-muted">{formatDate(comment.createdAt)}</small>
          </div>

          {isEditing ? (
            <div>
              <textarea
                className="form-control mb-2"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows="2"
              />
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleUpdate}
                  disabled={loading || !editContent.trim() || editContent === comment.content}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-0">{comment.content}</p>
              {isAuthor() && (
                <div className="d-flex justify-content-end mt-1">
                  <button
                    className="btn btn-sm btn-link text-secondary p-0 me-2"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button className="btn btn-sm btn-link text-danger p-0" onClick={handleDelete} disabled={loading}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem

