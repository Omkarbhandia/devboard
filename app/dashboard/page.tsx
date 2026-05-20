'use client'
import { useAuth } from '../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated, logout, initialLoading } = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
    router.push('/login')
  }
}, [isAuthenticated, initialLoading])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (initialLoading) return (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <p className="text-gray-400 text-sm">Loading...</p>
  </div>
)

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-2 transition-all duration-300 flex-shrink-0`}>

        {/* Logo + Toggle */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h1 className="text-xl font-bold text-white">DevBoard</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ml-auto"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium"
            title="Overview"
          >
            <span>🏠</span>
            {!collapsed && <span>Overview</span>}
          </Link>
          <Link href="/dashboard/github"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors"
            title="GitHub"
          >
            <span>🐙</span>
            {!collapsed && <span>GitHub</span>}
          </Link>
          <Link href="/dashboard/leetcode"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors"
            title="LeetCode"
          >
            <span>💻</span>
            {!collapsed && <span>LeetCode</span>}
          </Link>
          <Link href="/dashboard/tasks"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors"
            title="Tasks"
          >
            <span>✅</span>
            {!collapsed && <span>Tasks</span>}
          </Link>
        </nav>

        {/* User info + logout */}
            <div className="border-t border-gray-800 pt-4 pb-2">
            {!collapsed && (
                <>
                <p className="text-sm text-white font-medium truncate px-3">{user?.name}</p>
                <p className="text-xs text-gray-500 mb-3 truncate px-3">{user?.email}</p>
                </>
            )}
            <button
                onClick={handleLogout}
                className={`${collapsed ? 'justify-center' : 'justify-start'} w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-colors`}
                title="Logout"
            >
                <span>🚪</span>
                {!collapsed && <span>Logout</span>}
            </button>
            </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h2>
          <p className="text-gray-400 mt-1">Here's your developer overview</p>
        </div>

        {/* Stats Cards */}
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

        {/* Coming soon sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 border-dashed">
            <p className="text-gray-500 text-sm">GitHub stats coming soon...</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 border-dashed">
            <p className="text-gray-500 text-sm">LeetCode stats coming soon...</p>
          </div>
        </div>
      </main>

    </div>
  )
}