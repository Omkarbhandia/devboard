const express = require('express')
const axios = require('axios')
const protect = require('../middleware/auth')

const router = express.Router()

const GITHUB_API = 'https://api.github.com'

router.get('/:username', protect, async (req, res) => {
  try {
    const { username } = req.params
    const token = process.env.GITHUB_TOKEN

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    }

    const [profileRes, reposRes, eventsRes] = await Promise.all([
      axios.get(`${GITHUB_API}/users/${username}`, { headers, timeout: 10000 }),
      axios.get(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, { headers, timeout: 10000 }),
      axios.get(`${GITHUB_API}/users/${username}/events?per_page=100`, { headers, timeout: 10000 }),
    ])

    const profile = profileRes.data
    const repos = reposRes.data
    const events = eventsRes.data

    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
      }))

    const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)

    const recentCommits = events.filter(
      (event) => event.type === 'PushEvent'
    ).length

    const languageMap = {}
    repos.forEach((repo) => {
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1
      }
    })

    const topLanguages = Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }))

    res.status(200).json({
      profile: {
        name: profile.name,
        username: profile.login,
        avatar: profile.avatar_url,
        bio: profile.bio,
        followers: profile.followers,
        following: profile.following,
        publicRepos: profile.public_repos,
      },
      stats: {
        totalStars,
        recentCommits,
        totalRepos: repos.length,
      },
      topRepos,
      topLanguages,
    })
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' })
    }
    res.status(500).json({ message: error.message })
  }
})

module.exports = router