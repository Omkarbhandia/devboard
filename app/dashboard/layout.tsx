'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContent'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

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
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between border-b"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--border)",
        }}
      >
        <h1 className="text-xl font-bold font-mono">
          <span className="text-blue-400">▶</span> DevBoard
          <span className="animate-pulse text-blue-400">_</span>
        </h1>
        <div className="flex items-center gap-1">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden fixed top-12 left-0 right-0 z-40 border-b p-4 flex flex-col gap-1"
          style={{
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--border)",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor:
                  pathname === item.href ? "var(--hover-bg)" : "transparent",
                color:
                  pathname === item.href
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div
            className="border-t mt-2 pt-2"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-sm font-medium px-3"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.name}
            </p>
            <p
              className="text-xs px-3 mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {user?.email}
            </p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-red-400"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${collapsed ? "w-16" : "w-64"} flex-col p-4 gap-2 transition-all duration-300 flex-shrink-0 border-r`}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-lg font-bold font-mono">
              <span className="text-blue-400">▶</span> DevBoard
              <span className="animate-pulse text-blue-400">_</span>
            </h1>
          )}
          <div className="flex items-center gap-1 ml-auto">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
                title="Toggle theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor:
                  pathname === item.href ? "var(--hover-bg)" : "transparent",
                color:
                  pathname === item.href
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
              }}
              title={item.label}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div
          className="border-t pt-4 pb-2"
          style={{ borderColor: "var(--border)" }}
        >
          {!collapsed && (
            <>
              <p
                className="text-sm font-medium truncate px-3"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.name}
              </p>
              <p
                className="text-xs mb-3 truncate px-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {user?.email}
              </p>
            </>
          )}
          <button
            onClick={handleLogout}
            className={`${collapsed ? "justify-center" : "justify-start"} w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-colors`}
            title="Logout"
          >
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-12">{children}</main>
    </div>
  );
}