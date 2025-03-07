"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../components/auth/Button"

const Register = () => {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  const registerFunction = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost:3456/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, lastName, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || "Registro exitoso. Ahora puedes iniciar sesión.")

        // Redirigir al login después de un breve retraso
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(data.error || "Error al registrar el usuario")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error de conexión. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container container-auth">
      <div className="row w-100">
        <div className="col-4 ms-auto me-auto card p-4">
          <h1>Register</h1>
          <p>Crea una cuenta para acceder a la red social.</p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={registerFunction}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required
              />
            </div>

            <Button text={loading ? "Registrando..." : "Registro"} color="primary" disabled={loading} />

            <div className="mt-3 text-center">
              <p>
                ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

