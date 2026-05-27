'use client'
import { useAuth } from '../../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SkeletonCard, SkeletonProfile } from '../../components/Skeleton'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Repo {
  name: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  url: string
}

interface GitHubData {
  profile: {
    name: string
    username: string
    avatar: string
    bio: string | null
    followers: number
    following: number
    publicRepos: number
  }
  stats: {
    totalStars: number
    recentCommits: number
    totalRepos: number
  }
  topRepos: Repo[]
  topLanguages: { language: string; count: number }[]
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

export default function GithubPage() {
  const { user, isAuthenticated, initialLoading } = useAuth()
  const router = useRouter()
  const [githubData, setGithubData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, initialLoading])

  useEffect(() => {
    if (user?.githubUsername) {
      fetchGithubData()
    }
  }, [user])

  const fetchGithubData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${API_URL}/api/github/${user?.githubUsername}`,
        { withCredentials: true }
      )
      setGithubData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch GitHub data')
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
          <h2 className="text-2xl font-bold">GitHub</h2>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
            @{user?.githubUsername}
          </p>
        </div>
        <button
          onClick={fetchGithubData}
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
          <SkeletonProfile />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-64" />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {githubData && !loading && (
        <div>
          <div
            className="rounded-xl p-6 border mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-4 flex-1">
              <img
                src={githubData.profile.avatar}
                alt={githubData.profile.name}
                className="w-14 h-14 rounded-full flex-shrink-0"
              />
              <div>
                <h3 className="text-lg font-bold">{githubData.profile.name}</h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  @{githubData.profile.username}
                </p>
              </div>
            </div>
            <div
              className="flex gap-6 text-center sm:border-l sm:pl-6"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p className="text-xl font-bold">
                  {githubData.profile.followers}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Followers
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">
                  {githubData.profile.following}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Following
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">
                  {githubData.profile.publicRepos}
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
                Total Repos
              </p>
              <p className="text-3xl font-bold">
                {githubData.stats.totalRepos}
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
                Total Stars
              </p>
              <p className="text-3xl font-bold">
                {githubData.stats.totalStars}
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
                Recent Commits
              </p>
              <p className="text-3xl font-bold">
                {githubData.stats.recentCommits}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {githubData.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-4 p-3 rounded-lg transition-colors"
                    style={{ backgroundColor: "transparent" }}
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
                    <div
                      className="flex items-center gap-1 flex-shrink-0"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span className="text-xs">⭐ {repo.stars}</span>
                    </div>
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
                {githubData.topLanguages.map((item) => {
                  const total = githubData.topLanguages.reduce(
                    (a, b) => a + b.count,
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
        </div>
      )}
    </div>
  );
}