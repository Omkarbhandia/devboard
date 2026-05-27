"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContent";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    githubUsername: "",
    leetcodeUsername: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) router.push("/dashboard");
  };

  const features = [
    {
      icon: "🐙",
      title: "GitHub Analytics",
      desc: "Track commits, repos, stars and top languages",
    },
    {
      icon: "💻",
      title: "LeetCode Progress",
      desc: "Monitor problems solved, streaks and rankings",
    },
    {
      icon: "✅",
      title: "Task Manager",
      desc: "Manage daily tasks with priority levels",
    },
    {
      icon: "🔗",
      title: "Public Profile",
      desc: "Share your dev profile link on your resume",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #6366f1, transparent)",
            }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #3b82f6, transparent)",
            }}
          />
        </div>

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold font-mono text-white">
            <span className="text-indigo-400">▶</span> DevBoard
            <span className="animate-pulse text-indigo-400">_</span>
          </h1>
          <p className="text-indigo-300 mt-1 text-sm">
            Your developer dashboard
          </p>
        </div>

        {/* Hero text */}
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start tracking your developer journey today
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Join developers who use DevBoard to track their GitHub activity,
            LeetCode progress and share their profile with recruiters.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: "rgba(99, 102, 241, 0.15)" }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{f.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <p className="text-slate-600 text-xs">
          Built with Next.js · Node.js · MongoDB
        </p>
      </div>

      {/* Right Panel — Form */}
      <div
        className="w-full lg:w-1/2 flex flex-col lg:items-center lg:justify-center px-6 pb-12 lg:py-12"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="w-full lg:max-w-md">
          {/* Mobile header */}
          <div
            className="lg:hidden -mx-6 mb-8 px-6 py-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            }}
          >
            <h1 className="text-2xl font-bold font-mono text-white">
              <span className="text-indigo-400">▶</span> DevBoard
              <span className="animate-pulse text-indigo-400">_</span>
            </h1>
            <p className="text-sm mt-1 text-indigo-300">
              Your developer dashboard
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Free forever. No credit card required.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: "var(--text-secondary)" }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label
                className="text-sm mb-1 block"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  GitHub{" "}
                  <span style={{ color: "var(--text-tertiary)" }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-sm mb-1 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  LeetCode{" "}
                  <span style={{ color: "var(--text-tertiary)" }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  name="leetcodeUsername"
                  value={formData.leetcodeUsername}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p
            className="text-sm text-center mt-6"
            style={{ color: "var(--text-tertiary)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
