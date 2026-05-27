'use client'
import { useEffect, useState, use } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = use(params)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/profile/${username}`)
      setProfileData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile not found')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const LANGUAGE_COLORS: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    default: '#8b949e',
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="text-center">
        <p className="text-red-400 text-lg mb-2">Profile not found</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    </div>
  )

  if (!profileData) return null

  const { user, github, leetcode } = profileData

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="border-b"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold font-mono">
            <span className="text-blue-400">▶</span> DevBoard
            <span className="animate-pulse text-blue-400">_</span>
          </h1>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg text-sm transition-colors border"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {copied ? "✓ Copied!" : "Copy Profile Link"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {github && (
          <div
            className="rounded-xl p-6 border mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <img
              src={github.profile.avatar}
              alt={github.profile.name}
              className="w-20 h-20 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p style={{ color: "var(--text-secondary)" }}>
                @{github.profile.username}
              </p>
              <div className="flex gap-4 mt-3">
                {user.githubUsername && (
                  <a
                    href={`https://github.com/${user.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    🐙 GitHub
                  </a>
                )}
                {user.leetcodeUsername && (
                  <a
                    href={`https://leetcode.com/${user.leetcodeUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    💻 LeetCode
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-xl font-bold">{github.profile.followers}</p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Followers
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">
                  {github.profile.publicRepos}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Repos
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Repos", value: github?.stats.totalRepos || 0 },
            { label: "Commits", value: github?.stats.recentCommits || 0 },
            { label: "LC Solved", value: leetcode?.stats.total || 0 },
            { label: "Streak 🔥", value: leetcode?.streak.current || 0 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-4 border text-center"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-2xl font-bold">{item.value}</p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {github && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                Top Repositories
              </h3>
              <div className="flex flex-col gap-3">
                {github.topRepos.map((repo: any) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-4 p-3 rounded-lg transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--hover-bg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-400 truncate">
                        {repo.name}
                      </p>
                      {repo.description && (
                        <p
                          className="text-xs truncate mt-0.5"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {repo.description}
                        </p>
                      )}
                      {repo.language && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                LANGUAGE_COLORS[repo.language] ||
                                LANGUAGE_COLORS.default,
                            }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {repo.language}
                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      ⭐ {repo.stars}
                    </span>
                  </a>
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
                Top Languages
              </h3>
              <div className="flex flex-col gap-4">
                {github.topLanguages.map((item: any) => {
                  const total = github.topLanguages.reduce(
                    (a: number, b: any) => a + b.count,
                    0,
                  );
                  const percentage = Math.round((item.count / total) * 100);
                  return (
                    <div key={item.language}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                LANGUAGE_COLORS[item.language] ||
                                LANGUAGE_COLORS.default,
                            }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.language}
                          </span>
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {percentage}%
                        </span>
                      </div>
                      <div
                        className="w-full rounded-full h-1.5"
                        style={{ backgroundColor: "var(--input-bg)" }}
                      >
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              LANGUAGE_COLORS[item.language] ||
                              LANGUAGE_COLORS.default,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {leetcode && (
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
              LeetCode Stats
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-2xl font-bold text-green-400">
                  {leetcode.stats.easy}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Easy
                </p>
              </div>
              <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-2xl font-bold text-amber-400">
                  {leetcode.stats.medium}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Medium
                </p>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-2xl font-bold text-red-400">
                  {leetcode.stats.hard}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Hard
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
