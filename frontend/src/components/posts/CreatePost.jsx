"use client"

import { useState } from "react"
import Button from "../auth/Button"

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [img, setImg] = useState(null)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)

  // Función para manejar la selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImg(file)
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Función para crear una publicación
  const createPostFunction = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Obtener el ID del usuario del localStorage (asumiendo que se guarda allí después del login)
    const userID = localStorage.getItem("userId") || 1 // Valor por defecto para pruebas

    // Crear un FormData para enviar la imagen
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("userID", userID)
    if (img) {
      formData.append("img", img)
    }

    try {
      const response = await fetch("http://localhost:3456/api/posts/create", {
        method: "POST",
        body: formData, // No establecer Content-Type, FormData lo hace automáticamente
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        // Limpiar el formulario
        setTitle("")
        setContent("")
        setImg(null)
        setPreview("")

        // Notificar al componente padre que se ha creado una publicación
        if (onPostCreated) {
          onPostCreated()
        }
      } else {
        alert(data.error || "Error al crear la publicación")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-4 p-3">
      <h3>Crear nueva publicación</h3>
      <form onSubmit={createPostFunction}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Título
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Título de tu publicación"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Contenido
          </label>
          <textarea
            className="form-control"
            id="content"
            rows="3"
            placeholder="¿Qué estás pensando?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="img" className="form-label">
            Imagen (opcional)
          </label>
          <input type="file" className="form-control" id="img" accept="image/*" onChange={handleImageChange} />
        </div>

        {preview && (
          <div className="mb-3">
            <label className="form-label">Vista previa:</label>
            <div className="text-center">
              <img
                src={preview || "/placeholder.svg"}
                alt="Vista previa"
                className="img-fluid"
                style={{ maxHeight: "200px" }}
              />
            </div>
          </div>
        )}

        <Button text={loading ? "Publicando..." : "Publicar"} color="primary" disabled={loading} />
      </form>
    </div>
  )
}

export default CreatePost

