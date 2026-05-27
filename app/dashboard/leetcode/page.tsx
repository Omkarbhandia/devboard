'use client'
import { useAuth } from '../../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SkeletonCard } from '../../components/Skeleton'

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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">LeetCode</h2>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
            @{user?.leetcodeUsername}
          </p>
        </div>
        <button
          onClick={fetchLeetcodeData}
          className="px-4 py-2 rounded-lg text-sm transition-colors border"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard className="h-48 mb-6" />
          <SkeletonCard className="h-48" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {leetcodeData && !loading && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Global Ranking
              </p>
              <p className="text-3xl font-bold">
                #{leetcodeData.profile.ranking.toLocaleString()}
              </p>
            </div>
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Current Streak
              </p>
              <p className="text-3xl font-bold">
                {leetcodeData.streak.current} 🔥
              </p>
            </div>
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-sm mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Active Days
              </p>
              <p className="text-3xl font-bold">
                {leetcodeData.streak.totalActiveDays}
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-6 border mb-6"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h3
              className="text-sm font-medium mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Problems Solved
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Total",
                  value: leetcodeData.stats.total,
                  color: "#3b82f6",
                },
                {
                  label: "Easy",
                  value: leetcodeData.stats.easy,
                  color: "#22c55e",
                },
                {
                  label: "Medium",
                  value: leetcodeData.stats.medium,
                  color: "#f59e0b",
                },
                {
                  label: "Hard",
                  value: leetcodeData.stats.hard,
                  color: "#ef4444",
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="var(--input-bg)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="3"
                        strokeDasharray={`${item.value} 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{item.value}</span>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: item.color }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <h3
              className="text-sm font-medium mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Recent Accepted Submissions
            </h3>
            {leetcodeData.recentSubmissions.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                No recent submissions found.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {leetcodeData.recentSubmissions.map((sub) => (
                  <a
                    key={sub.slug}
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--hover-bg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <p className="text-sm text-blue-400">{sub.title}</p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {new Date(
                        parseInt(sub.timestamp) * 1000,
                      ).toLocaleDateString()}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}