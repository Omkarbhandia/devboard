const express = require('express')
const axios = require('axios')
const protect = require('../middleware/auth')

const router = express.Router()

router.get('/:username', protect, async (req, res) => {
  try {
    const { username } = req.params

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
        recentAcSubmissionList(username: $username, limit: 10) {
          title
          titleSlug
          timestamp
        }
      }
    `

    const response = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables: { username } },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        },
        timeout: 10000,
      }
    )

    const data = response.data.data
    if (!data.matchedUser) {
      return res.status(404).json({ message: 'LeetCode user not found' })
    }

    const user = data.matchedUser
    const submitStats = user.submitStats.acSubmissionNum

    const easy = submitStats.find(s => s.difficulty === 'Easy')?.count || 0
    const medium = submitStats.find(s => s.difficulty === 'Medium')?.count || 0
    const hard = submitStats.find(s => s.difficulty === 'Hard')?.count || 0
    const total = submitStats.find(s => s.difficulty === 'All')?.count || 0

    const recentSubmissions = data.recentAcSubmissionList.map(sub => ({
      title: sub.title,
      slug: sub.titleSlug,
      timestamp: sub.timestamp,
      url: `https://leetcode.com/problems/${sub.titleSlug}/`,
    }))

    res.status(200).json({
      profile: {
        username: user.username,
        ranking: user.profile.ranking,
        reputation: user.profile.reputation,
      },
      stats: {
        total,
        easy,
        medium,
        hard,
      },
      streak: {
        current: user.userCalendar?.streak || 0,
        totalActiveDays: user.userCalendar?.totalActiveDays || 0,
      },
      recentSubmissions,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router