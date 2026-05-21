'use client'
import { useAuth } from '../../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface LeetCodeData {
  profile: {
    username: string
    ranking: number
    reputation: number
  }
  stats: {
    total: number
    easy: number
    medium: number
    hard: number
  }
  streak: {
    current: number
    totalActiveDays: number
  }
  recentSubmissions: {
    title: string
    slug: string
    timestamp: string
    url: string
  }[]
}

export default function LeetcodePage() {
  const { user, isAuthenticated, initialLoading } = useAuth()
  const router = useRouter()
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, initialLoading])

  useEffect(() => {
    if (user?.leetcodeUsername) {
      fetchLeetcodeData()
    }
  }, [user])

  const fetchLeetcodeData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${API_URL}/api/leetcode/${user?.leetcodeUsername}`,
        { withCredentials: true }
      )
      setLeetcodeData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch LeetCode data')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">LeetCode</h2>
          <p className="text-gray-400 mt-1">@{user?.leetcodeUsername}</p>
        </div>
        <button
          onClick={fetchLeetcodeData}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">Fetching LeetCode data...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {leetcodeData && !loading && (
        <div>

          {/* Profile + Streak Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Global Ranking</p>
              <p className="text-3xl font-bold">
                #{leetcodeData.profile.ranking.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Current Streak</p>
              <p className="text-3xl font-bold">{leetcodeData.streak.current} 🔥</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Total Active Days</p>
              <p className="text-3xl font-bold">{leetcodeData.streak.totalActiveDays}</p>
            </div>
          </div>

          {/* Problems Solved */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-6">Problems Solved</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

              {/* Total */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#3b82f6" strokeWidth="3"
                      strokeDasharray={`${leetcodeData.stats.total} 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{leetcodeData.stats.total}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Total</p>
              </div>

              {/* Easy */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#22c55e" strokeWidth="3"
                      strokeDasharray={`${leetcodeData.stats.easy} 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{leetcodeData.stats.easy}</span>
                  </div>
                </div>
                <p className="text-sm text-green-400">Easy</p>
              </div>

              {/* Medium */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#f59e0b" strokeWidth="3"
                      strokeDasharray={`${leetcodeData.stats.medium} 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{leetcodeData.stats.medium}</span>
                  </div>
                </div>
                <p className="text-sm text-amber-400">Medium</p>
              </div>

              {/* Hard */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#ef4444" strokeWidth="3"
                      strokeDasharray={`${leetcodeData.stats.hard} 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{leetcodeData.stats.hard}</span>
                  </div>
                </div>
                <p className="text-sm text-red-400">Hard</p>
              </div>

            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Recent Accepted Submissions</h3>
            {leetcodeData.recentSubmissions.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent submissions found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {leetcodeData.recentSubmissions.map((sub) => (
                  <a
                    key={sub.slug}
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <p className="text-sm text-blue-400">{sub.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(parseInt(sub.timestamp) * 1000).toLocaleDateString()}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}