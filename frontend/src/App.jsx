import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { AuthProvider } from "./components/auth/AuthContext"
import Post from "./components/posts/Post"
import Navbar from './components/Navbar'
import ChangePassword from "./components/auth/ChangePassword"
import ForgotPassword from "./pages/auth/ForgotPassword"
import TwoFA from "./pages/auth/2FA"
const App = () => {
  return (
    <AuthProvider>
      {localStorage.getItem("userId") ? (<Navbar />) : ""}
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
          <Route path="/2fa/:id" element={<TwoFA />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/change-password/:token" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Redirigir cualquier otra ruta a Home (que está protegida) */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      {/* </Router> */}
    </AuthProvider>
  )
}

export default App

  