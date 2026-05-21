'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContent'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Overview' },
    { href: '/dashboard/github', icon: '🐙', label: 'GitHub' },
    { href: '/dashboard/leetcode', icon: '💻', label: 'LeetCode' },
    { href: '/dashboard/tasks', icon: '✅', label: 'Tasks' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">DevBoard</h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-gray-800 text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="border-t border-gray-800 mt-2 pt-2">
            <p className="text-sm text-white px-3">{user?.name}</p>
            <p className="text-xs text-gray-500 px-3 mb-2">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex ${collapsed ? 'w-16' : 'w-64'} bg-gray-900 border-r border-gray-800 flex-col p-4 gap-2 transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h1 className="text-xl font-bold text-white">DevBoard</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ml-auto"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-gray-800 text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={item.label}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

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

      {/* Page Content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-12">
        {children}
      </main>

    </div>
  )
}