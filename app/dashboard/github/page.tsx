'use client'
import { useAuth } from '../../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GithubPage() {
  const { isAuthenticated, initialLoading } = useAuth()
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

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">GitHub stats coming soon...</p>
    </div>
  )
}