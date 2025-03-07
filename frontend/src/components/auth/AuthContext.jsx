"use client"

import { createContext, useState, useEffect, useContext } from "react"

// Crear el contexto
const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext)
}

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (token && userId) {
      // Opcionalmente, puedes hacer una petición al servidor para validar el token
      // y obtener los datos del usuario
      setCurrentUser({ id: userId })
    }

    setLoading(false)
  }, [])

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3456/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.userId)
        setCurrentUser({ id: data.userId })
        return { success: true }
      } else {
        return { success: false, error: data.error || "Error al iniciar sesión" }
      }
    } catch (error) {
      console.error("Error:", error)
      return { success: false, error: "Error de conexión. Intente nuevamente." }
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Opcionalmente, hacer una petición al servidor para invalidar el token
      await fetch("http://localhost:3456/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      // Limpiar localStorage y estado
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      setCurrentUser(null)
    }
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!currentUser
  }

  // Valor que se proporcionará a los componentes
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

