"use client";
import { useAuth } from "../context/AuthContent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { SkeletonCard } from "../components/Skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const { user, isAuthenticated, initialLoading } = useAuth();
  const router = useRouter();
  const [githubStats, setGithubStats] = useState<any>(null);
  const [leetcodeStats, setLeetcodeStats] = useState<any>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, initialLoading]);

  useEffect(() => {
    if (!initialLoading && isAuthenticated && user) {
      fetchOverviewData();
    }
  }, [initialLoading, isAuthenticated, user]);

  const fetchOverviewData = async () => {
    try {
      setStatsLoading(true);
      const [tasksRes] = await Promise.all([
        axios.get(`${API_URL}/api/tasks`, { withCredentials: true }),
      ]);
      setTaskCount(
        tasksRes.data.filter((t: any) => t.status === "active").length,
      );

      if (user?.githubUsername) {
        const githubRes = await axios.get(
          `${API_URL}/api/github/${user.githubUsername}`,
          { withCredentials: true },
        );
        setGithubStats(githubRes.data.stats);
      }

      if (user?.leetcodeUsername) {
        const leetcodeRes = await axios.get(
          `${API_URL}/api/leetcode/${user.leetcodeUsername}`,
          { withCredentials: true },
        );
        setLeetcodeStats(leetcodeRes.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  if (initialLoading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h2>
        <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
          Here's your developer overview
        </p>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
              GitHub Commits
            </p>
            <p className="text-3xl font-bold">
              {githubStats ? githubStats.recentCommits : "—"}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Recent commits
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
              LeetCode Solved
            </p>
            <p className="text-3xl font-bold">
              {leetcodeStats ? leetcodeStats.total : "—"}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Total problems
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
              Tasks
            </p>
            <p className="text-3xl font-bold">{taskCount}</p>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Pending today
            </p>
          </div>
        </div>
      )}

      {/* Public Profile Link */}
      <div
        className="rounded-lg px-4 py-3 border mb-6 flex items-center justify-between gap-3 w-full sm:w-1/2"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        {" "}
        <p className="text-sm font-medium flex-shrink-0">🔗 Public Profile</p>
        <div className="flex items-center gap-2 flex-shrink-0">
    <p className="text-xs truncate hidden md:block" style={{ color: 'var(--text-tertiary)', maxWidth: '180px' }}>
      {typeof window !== 'undefined' ? `${window.location.origin}/profile/${user?.githubUsername}` : ''}
    </p>
    <button
      onClick={() => {
        navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.githubUsername}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
    >
      {copied ? '✓ Copied!' : 'Copy Link'}
    </button>
  </div>
      </div>

      {/* Quick Links */}
      {statsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/github"
            className="rounded-xl p-6 border transition-colors block"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🐙</span>
              <h3 className="font-medium">GitHub</h3>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {githubStats
                ? `${githubStats.totalRepos} repos · ${githubStats.totalStars} stars`
                : "View your GitHub stats"}
            </p>
          </Link>
          <Link
            href="/dashboard/leetcode"
            className="rounded-xl p-6 border transition-colors block"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💻</span>
              <h3 className="font-medium">LeetCode</h3>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {leetcodeStats
                ? `${leetcodeStats.easy} easy · ${leetcodeStats.medium} medium · ${leetcodeStats.hard} hard`
                : "View your LeetCode stats"}
            </p>
          </Link>
          <Link
            href="/dashboard/tasks"
            className="rounded-xl p-6 border transition-colors block"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">✅</span>
              <h3 className="font-medium">Tasks</h3>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {taskCount > 0
                ? `${taskCount} pending task${taskCount > 1 ? "s" : ""}`
                : "No pending tasks"}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
