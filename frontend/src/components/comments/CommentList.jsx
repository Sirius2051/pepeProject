"use client"

import { useState, useEffect } from "react"
import CommentItem from "./CommentItem"
import CommentForm from "./CommentForm"

const CommentList = ({ postID }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showComments, setShowComments] = useState(false)

  // Cargar comentarios
  const loadComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3456/api/comments/post/${postID}`)

      if (!response.ok) {
        throw new Error("Error al cargar los comentarios")
      }

      const data = await response.json()
      setComments(data)
      setError(null)
    } catch (error) {
      console.error("Error:", error)
      setError("No se pudieron cargar los comentarios")
    } finally {
      setLoading(false)
    }
  }

  // Cargar comentarios cuando se muestra la sección
  useEffect(() => {
    if (showComments) {
      loadComments()
    }
  }, [showComments])

  // Manejar la adición de un nuevo comentario
  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments])
  }

  // Manejar la actualización de un comentario
  const handleCommentUpdated = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
    )
  }

  // Manejar la eliminación de un comentario
  const handleCommentDeleted = (commentId) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId))
  }

  return (
    <div className="mt-3">
      <button className="btn btn-link text-decoration-none p-0" onClick={() => setShowComments(!showComments)}>
        {showComments ? "Ocultar comentarios" : "Mostrar comentarios"}
      </button>

      {showComments && (
        <div className="mt-3">
          <CommentForm postID={postID} onCommentAdded={handleCommentAdded} />

          {loading ? (
            <div className="text-center my-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-muted my-3">No hay comentarios. ¡Sé el primero en comentar!</div>
          ) : (
            <div>
              <div className="mb-2 text-muted">
                {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
              </div>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onCommentDeleted={handleCommentDeleted}
                  onCommentUpdated={handleCommentUpdated}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentList

