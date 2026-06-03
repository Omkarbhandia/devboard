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
    updateProfile: (data: { githubUsername?: string; leetcodeUsername?: string }) => Promise<boolean>
    updateName: (name: string) => Promise<boolean>
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
    deleteAccount: () => Promise<boolean>
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

    const updateProfile = async (data: { githubUsername?: string; leetcodeUsername?: string }): Promise<boolean> => {
  try {
    setLoading(true)
    const res = await axios.patch(`${API_URL}/api/auth/profile`, data, {
      withCredentials: true,
    })
    setUser(res.data)
    return true
  } catch (err: any) {
    setError(err.response?.data?.message || 'Update failed')
    return false
  } finally {
    setLoading(false)
  }
    }
    
    const updateName = async (name: string): Promise<boolean> => {
  try {
    setLoading(true)
    const res = await axios.patch(`${API_URL}/api/auth/name`, { name }, {
      withCredentials: true,
    })
    setUser(res.data)
    return true
  } catch (err: any) {
    setError(err.response?.data?.message || 'Update failed')
    return false
  } finally {
    setLoading(false)
  }
}

const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    setLoading(true)
    await axios.patch(`${API_URL}/api/auth/password`, { currentPassword, newPassword }, {
      withCredentials: true,
    })
    return true
  } catch (err: any) {
    setError(err.response?.data?.message || 'Password update failed')
    return false
  } finally {
    setLoading(false)
  }
}

const deleteAccount = async (): Promise<boolean> => {
  try {
    setLoading(true)
    await axios.delete(`${API_URL}/api/auth/account`, { withCredentials: true })
    setUser(null)
    setIsAuthenticated(false)
    return true
  } catch (err: any) {
    setError(err.response?.data?.message || 'Delete failed')
    return false
  } finally {
    setLoading(false)
  }
}

    return (
        <AuthContext.Provider value={{user, isAuthenticated, loading, error, register, login, logout, clearError, initialLoading, updateProfile, updateName, changePassword, deleteAccount}}>
            {children}
        </AuthContext.Provider>
    )
} 

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be within AuthProvider')
    return context    
}