const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth')

const router = express.Router()


//Genrate token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

router.post('/register', async (req, res) => {
    try {
        const {name, email, password, githubUsername, leetcodeUsername} = req.body

        const userExists = await User.findOne({email})
        if (userExists) {
            return res.status(400).json({message: 'User already exists!'})
        }

        //New User
        const user = await User.create({
            name,
            email,
            password,
            githubUsername,
            leetcodeUsername,
        })

        // Generate token and set Cookie
        const token = generateToken(user._id)
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            githubUsername: user.githubUsername,
            leetcodeUsername: user.leetcodeUsername,
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//login route

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate token and set cookie
    const token = generateToken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      leetcodeUsername: user.leetcodeUsername,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 0,
  })
  res.status(200).json({ message: 'Logged out successfully' })
})

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route PATCH /api/auth/profile
router.patch('/profile', protect, async (req, res) => {
  try {
    const { githubUsername, leetcodeUsername } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (githubUsername !== undefined) user.githubUsername = githubUsername
    if (leetcodeUsername !== undefined) user.leetcodeUsername = leetcodeUsername
    await user.save()
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      leetcodeUsername: user.leetcodeUsername,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route PATCH /api/auth/password
router.patch('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' })

    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' })

    user.password = newPassword
    await user.save()
    res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route PATCH /api/auth/name
router.patch('/name', protect, async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.name = name
    await user.save()
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      leetcodeUsername: user.leetcodeUsername,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route DELETE /api/auth/account
router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.cookie('token', '', { maxAge: 0 })
    res.status(200).json({ message: 'Account deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
