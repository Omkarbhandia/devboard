'use client'
import { useAuth } from '../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DashboardPage() {
  const { user, isAuthenticated, initialLoading } = useAuth()
  const router = useRouter()
  const [githubStats, setGithubStats] = useState<any>(null)
  const [leetcodeStats, setLeetcodeStats] = useState<any>(null)
  const [taskCount, setTaskCount] = useState(0)

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, initialLoading])

  useEffect(() => {
    if (!initialLoading && isAuthenticated && user) {
      fetchOverviewData()
    }
  }, [initialLoading, isAuthenticated, user])

  const fetchOverviewData = async () => {
    try {
      const [tasksRes] = await Promise.all([
        axios.get(`${API_URL}/api/tasks`, { withCredentials: true }),
      ])
      setTaskCount(tasksRes.data.filter((t: any) => t.status === 'active').length)

      if (user?.githubUsername) {
        const githubRes = await axios.get(
          `${API_URL}/api/github/${user.githubUsername}`,
          { withCredentials: true }
        )
        setGithubStats(githubRes.data.stats)
      }

      if (user?.leetcodeUsername) {
        const leetcodeRes = await axios.get(
          `${API_URL}/api/leetcode/${user.leetcodeUsername}`,
          { withCredentials: true }
        )
        setLeetcodeStats(leetcodeRes.data.stats)
      }
    } catch (err) {
      console.error(err)
    }
  }

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">GitHub Commits</p>
          <p className="text-3xl font-bold">
            {githubStats ? githubStats.recentCommits : '—'}
          </p>
          <p className="text-gray-500 text-xs mt-1">Recent commits</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">LeetCode Solved</p>
          <p className="text-3xl font-bold">
            {leetcodeStats ? leetcodeStats.total : '—'}
          </p>
          <p className="text-gray-500 text-xs mt-1">Total problems</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Tasks</p>
          <p className="text-3xl font-bold">{taskCount}</p>
          <p className="text-gray-500 text-xs mt-1">Pending today</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/github"
          className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🐙</span>
            <h3 className="font-medium">GitHub</h3>
          </div>
          <p className="text-gray-400 text-sm">
            {githubStats
              ? `${githubStats.totalRepos} repos · ${githubStats.totalStars} stars`
              : 'View your GitHub stats'}
          </p>
        </Link>

        <Link href="/dashboard/leetcode"
          className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💻</span>
            <h3 className="font-medium">LeetCode</h3>
          </div>
          <p className="text-gray-400 text-sm">
            {leetcodeStats
              ? `${leetcodeStats.easy} easy · ${leetcodeStats.medium} medium · ${leetcodeStats.hard} hard`
              : 'View your LeetCode stats'}
          </p>
        </Link>

        <Link href="/dashboard/tasks"
          className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">✅</span>
            <h3 className="font-medium">Tasks</h3>
          </div>
          <p className="text-gray-400 text-sm">
            {taskCount > 0
              ? `${taskCount} pending task${taskCount > 1 ? 's' : ''}`
              : 'No pending tasks'}
          </p>
        </Link>
      </div>
    </div>
  )
}