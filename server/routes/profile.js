const express = require('express')
const User = require('../models/User')
const axios = require('axios')

const router = express.Router()

const GITHUB_API = 'https://api.github.com'

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params

    const user = await User.findOne({ githubUsername: username }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    }

    let github = null
    let leetcode = null

    if (user.githubUsername) {
      const [profileRes, reposRes, eventsRes] = await Promise.all([
        axios.get(`${GITHUB_API}/users/${user.githubUsername}`, { headers, timeout: 10000 }),
        axios.get(`${GITHUB_API}/users/${user.githubUsername}/repos?per_page=100&sort=updated`, { headers, timeout: 10000 }),
        axios.get(`${GITHUB_API}/users/${user.githubUsername}/events?per_page=100`, { headers, timeout: 10000 }),
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
      const recentCommits = events.filter(e => e.type === 'PushEvent').length

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

      github = {
        profile: {
          name: profile.name,
          username: profile.login,
          avatar: profile.avatar_url,
          bio: profile.bio,
          followers: profile.followers,
          following: profile.following,
          publicRepos: profile.public_repos,
        },
        stats: { totalStars, recentCommits, totalRepos: repos.length },
        topRepos,
        topLanguages,
      }
    }

    if (user.leetcodeUsername) {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
            userCalendar {
              streak
              totalActiveDays
            }
          }
        }
      `
      const lcRes = await axios.post(
        'https://leetcode.com/graphql',
        { query, variables: { username: user.leetcodeUsername } },
        {
          headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' },
          timeout: 10000,
        }
      )

      const lcUser = lcRes.data.data.matchedUser
      if (lcUser) {
        const submitStats = lcUser.submitStats.acSubmissionNum
        leetcode = {
          stats: {
            total: submitStats.find(s => s.difficulty === 'All')?.count || 0,
            easy: submitStats.find(s => s.difficulty === 'Easy')?.count || 0,
            medium: submitStats.find(s => s.difficulty === 'Medium')?.count || 0,
            hard: submitStats.find(s => s.difficulty === 'Hard')?.count || 0,
          },
          streak: {
            current: lcUser.userCalendar?.streak || 0,
            totalActiveDays: lcUser.userCalendar?.totalActiveDays || 0,
          },
        }
      }
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        leetcodeUsername: user.leetcodeUsername,
      },
      github,
      leetcode,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router