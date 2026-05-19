const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
  res.cookie('token', '', { maxAge: 0 })
  res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = router
