'use client'
import { useState } from 'react'
import { useAuth } from '../context/AuthContent'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError()
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(formData.email, formData.password)
    if (success) router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md rounded-2xl p-8 shadow-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">DevBoard</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Welcome back</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="omkar@gmail.com"
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-3 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: 'var(--text-tertiary)' }}>
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}