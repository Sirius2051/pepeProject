

"use client"

import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
const [resetToken, setResetToken] = useState(false)
const [userId, setUserId] = useState("")
  // Obtener token de los parámetros de la ruta
  const { token } = useParams()

  // Alternativa: obtener token de query params
  const useQuery = () => new URLSearchParams(useLocation().search)
  const query = useQuery()
  const queryToken = query.get("token")

  // Usar el token de la ruta o de query params
//   const resetToken = token || queryToken

  const navigate = useNavigate()
    useEffect(()=> {
        fetch('http://localhost:3456/api/users/verify-token', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token: token})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setUserId(data.user.userId)
            setResetToken(data.verifyStatus)
        })
    })
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    // Validar longitud mínima
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Llamada a la API para cambiar la contraseña
      const response = await fetch("http://localhost:3456/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          newPassword,
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
                {!resetToken && (
                  <div className="alert alert-danger">
                    No se proporcionó un token válido. No se puede cambiar la contraseña.
                  </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                {success && (
                  <div className="alert alert-success">
                    ¡Contraseña cambiada exitosamente! Redirigiendo al inicio de sesión...
                  </div>
                )}

                {resetToken && !success && (
                  <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <div className="form-text">La contraseña debe tener al menos 8 caracteres.</div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword

