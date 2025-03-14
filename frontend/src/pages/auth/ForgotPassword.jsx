

"use client"

import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"


const ForgotPassword = () => {
    const [email, setEmail] = useState("")
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState("")
      
const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      // Llamada a la API para cambiar la contraseña
      const response = await fetch("http://localhost:3456/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña")
      }

      setSuccess(true)

      // Redireccionar después de 3 segundos
    //   setTimeout(() => {
    //     navigate("/login")
    //   }, 3000)
    } catch (err) {
      setError(err.message || "Ocurrió un error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }
    return (

        <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3 className="text-center mb-0">Cambiar Contraseña</h3>
              </div>
              <div className="card-body">
                
                  <form onSubmit={handleSubmit}>
                

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Procesando...
                          </>
                        ) : (
                          "Cambiar Contraseña"
                        )}
                      </button>
                    </div>
                  </form>
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    )
}

export default ForgotPassword