'use client'
import axios from 'axios'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'


const API_URL = process.env.NEXT_PUBLIC_API_URL

interface User {
    _id: string
    name: string
    email: string
    githubUsername: string
    leetcodeUsername: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    initialLoading: boolean
    error: string | null
    register: (data: RegisterData) => Promise<boolean>
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    clearError: () => void
}


interface RegisterData{
  name: string
  email: string
  password: string
  githubUsername: string
  leetcodeUsername: string
}


const AuthContext = createContext<AuthContextType | undefined> (undefined)

export const AuthProvider = ({ children }: {children: ReactNode}) => {

    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError]  = useState<string | null>(null)


    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/auth/me`, {
            withCredentials: true,
          });
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setInitialLoading(false);
        }
      };
      checkAuth();
    }, []);


    const register = async (data: RegisterData): Promise<boolean> => {
        try {
            setLoading(true)
            const res = await axios.post(`${API_URL}/api/auth/register`, data, {
            withCredentials: true,
            })
            setUser(res.data)
            setIsAuthenticated(true)
            return true
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed')
            return false
        } finally {
            setLoading(false)
        }
    }


    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true)
            const res = await axios.post(
            `${API_URL}/api/auth/login`,
            { email, password },
            { withCredentials: true }
            )
            setUser(res.data)
            setIsAuthenticated(true)
            return true
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed')
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/logout`, {}, {withCredentials: true})
            setUser(null)
            setIsAuthenticated(false)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Logout failed')
        }
    }

    const clearError = () => setError(null)

    return (
        <AuthContext.Provider value={{user, isAuthenticated, loading, error, register, login, logout, clearError, initialLoading}}>
            {children}
        </AuthContext.Provider>
    )
} 

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be within AuthProvider')
    return context    
}