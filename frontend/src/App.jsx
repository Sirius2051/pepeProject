import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { AuthProvider } from "./components/auth/AuthContext"

const App = () => {
  return (
    <AuthProvider>
      {/* <Router> */}
        <Routes>
          {/* Ruta protegida para Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirigir cualquier otra ruta a Home (que está protegida) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      {/* </Router> */}
    </AuthProvider>
  )
}

export default App

  