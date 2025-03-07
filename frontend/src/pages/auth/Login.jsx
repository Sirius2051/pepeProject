"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Button from "../../components/auth/Button"
import Input from "../../components/auth/Input"    
import { useAuth } from "../../components/auth/AuthContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  // Obtener la ruta desde donde fue redirigido (si existe)
  const from = location.state?.from?.pathname || "/"

  // Verificar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true })
    }
  }, [from, navigate, isAuthenticated])

  const loginFunction = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(email, password)

      if (result.success) {
        // Mostrar mensaje de éxito
        alert("Inicio de sesión exitoso")

        // Redirigir a la página desde donde fue redirigido o al home
        navigate(from, { replace: true })
      } else {
        setError(result.error)
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
          <h1>Login</h1>
          <p>Ingresa tus credenciales para acceder a tu cuenta.</p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={loginFunction}>
            <div className="mb-3">
              <Input
                config={{
                  type: "email",
                  className: "",
                  id: "email",
                  placeholder: "Email",
                  change: (e) => {
                    setEmail(e.target.value)
                  },
                }}
              />
            </div>
            <div className="mb-3">
              <Input
                config={{
                  type: "password",
                  className: "",
                  id: "password",
                  placeholder: "Password",
                  change: (e) => {
                    setPassword(e.target.value)
                  },
                }}
              />
            </div>

            <Button text={loading ? "Iniciando sesión..." : "Login"} color="primary" disabled={loading} />

            <div className="mt-3 text-center">
              <p>
                ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

