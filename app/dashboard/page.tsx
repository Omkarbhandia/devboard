'use client'
import { useAuth } from '../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, isAuthenticated, initialLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, initialLoading])

  if (initialLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  if (!user) return null

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h2>
        <p className="text-gray-400 mt-1">Here's your developer overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">GitHub</p>
          <p className="text-xl font-bold truncate">{user?.githubUsername || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">Connected account</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">LeetCode</p>
          <p className="text-xl font-bold truncate">{user?.leetcodeUsername || '—'}</p>
          <p className="text-gray-500 text-xs mt-1">Connected account</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Tasks</p>
          <p className="text-xl font-bold">0</p>
          <p className="text-gray-500 text-xs mt-1">Pending today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 border-dashed">
          <p className="text-gray-500 text-sm">GitHub stats coming soon...</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 border-dashed">
          <p className="text-gray-500 text-sm">LeetCode stats coming soon...</p>
        </div>
      </div>
    </div>
  )
}