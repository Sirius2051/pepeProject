

"use client"

import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"


const TwoFA = () => {
    const navigate = useNavigate()
    const [code, setCode] = useState("")
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState("")
      const { id } = useParams()
        const handleSubmit = async (e) => {
            e.preventDefault()

            try {
            setLoading(true)
            setError("")
            
            // Llamada a la API para cambiar la contraseña
            const response = await fetch("http://localhost:3456/api/users/verify-code", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                code: code,
                userID: id
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Error al verificar codigo")
            } else {
                console.log(response);
                navigate("/");

            }

            setSuccess(true)

              setTimeout(() => {
              }, 3000)
            } catch (err) {
            setError(err.message || "Ocurrió un error al verificar codigo")
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
                <h3 className="text-center mb-0">2FA</h3>
              </div>
              <div className="card-body">
                
                  <form onSubmit={handleSubmit}>
                

                    <div className="mb-3">
                      <label htmlFor="code" className="form-label">
                        Codigo de verificacion
                      </label>
                      <input
                        type="code"
                        className="form-control"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
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
                          "Verificar"
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

export default TwoFA