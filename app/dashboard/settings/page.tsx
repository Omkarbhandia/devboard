'use client'
import { useAuth } from '../../context/AuthContent'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const { user, isAuthenticated, initialLoading, updateProfile, updateName, changePassword, deleteAccount, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const [nameSaved, setNameSaved] = useState(false)
  const [accountsSaved, setAccountsSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, initialLoading])

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setGithubUsername(user.githubUsername || '')
      setLeetcodeUsername(user.leetcodeUsername || '')
    }
  }, [user])

  const handleNameSave = async () => {
    const success = await updateName(name)
    if (success) {
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    }
  }

  const handleAccountsSave = async () => {
    const success = await updateProfile({ githubUsername, leetcodeUsername })
    if (success) {
      setAccountsSaved(true)
      setTimeout(() => setAccountsSaved(false), 2000)
    }
  }

  const handlePasswordSave = async () => {
    setPasswordError('')
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }
    const success = await changePassword(currentPassword, newPassword)
    if (success) {
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 2000)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    if (deleteConfirm !== user?.email) {
      setDeleteError('Email does not match')
      return
    }
    const success = await deleteAccount()
    if (success) router.push('/register')
  }

  if (initialLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  )

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your account</p>
      </div>

      {/* Display Name */}
      <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>Display Name</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={handleNameSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
          >
            {nameSaved ? '✓ Saved!' : 'Save'}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Email: {user?.email}</p>
      </div>

      {/* Connected Accounts */}
      <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>Connected Accounts</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>🐙 GitHub Username</label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Your GitHub username"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>💻 LeetCode Username</label>
            <input
              type="text"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              placeholder="Your LeetCode username"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <button
            onClick={handleAccountsSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit"
          >
            {accountsSaved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>Change Password</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Your current password"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          {passwordError && (
            <p className="text-red-400 text-xs">{passwordError}</p>
          )}
          {passwordSaved && (
            <p className="text-green-400 text-xs">✓ Password updated successfully</p>
          )}
          <button
            onClick={handlePasswordSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl p-6 border border-red-500/20" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h3 className="text-sm font-medium text-red-400 mb-1">Danger Zone</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          Permanently delete your account and all your data. This action cannot be undone.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Type your email <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.email}</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          {deleteError && (
            <p className="text-red-400 text-xs">{deleteError}</p>
          )}
          <button
            onClick={handleDeleteAccount}
            disabled={loading || deleteConfirm !== user?.email}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/30 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit"
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>

    </div>
  )
}