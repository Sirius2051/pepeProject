"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CreatePost from "../components/posts/CreatePost"
import PostCard from "../components/posts/PostCard"
import { useAuth } from "../components/auth/AuthContext"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Función para cargar las publicaciones
  const loadPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3456/api/posts/")
      if (!response.ok) {
        throw new Error("Error al cargar las publicaciones")
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    loadPosts()
  }, []) //Fixed: Added empty dependency array [] to useEffect

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar / Perfil */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Mi Perfil</h5>
              <p className="card-text">Bienvenido a tu red social</p>
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-primary btn-sm">Editar perfil</button>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Navegación</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Inicio</li>
                <li className="list-group-item">Explorar</li>
                <li className="list-group-item">Notificaciones</li>
                <li className="list-group-item">Mensajes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feed principal */}
        <div className="col-md-6">
          <CreatePost onPostCreated={loadPosts} />

          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No hay publicaciones disponibles. ¡Sé el primero en publicar algo!
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Tendencias / Sugerencias */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Tendencias</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">#Tecnología</li>
                <li className="list-group-item">#Programación</li>
                <li className="list-group-item">#JavaScript</li>
                <li className="list-group-item">#React</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sugerencias</h5>
              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: "32px", height: "32px" }}
                >
                  U
                </div>
                <div>Usuario Sugerido</div>
                <button className="btn btn-sm btn-outline-primary ms-auto">Seguir</button>
              </div>
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: "32px", height: "32px" }}
                >
                  U
                </div>
                <div>Otro Usuario</div>
                <button className="btn btn-sm btn-outline-primary ms-auto">Seguir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

