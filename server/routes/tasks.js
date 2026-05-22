const express = require('express')
const Task = require('../models/Task')
const protect = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.post('/', protect, async (req, res) => {
    try {
        const { title, priority } = req.body
        if (!title) {
            return res.status(400).json({ message: 'Title is required!'})
        }

        const task = await Task.create({
            title,
            priority: priority || 'medium',
            userId: req.user._id,
        })
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})


router.patch('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id })
        if (!task) {
            return res.status(404).json({ message: 'Task not found!'})
        }

        const { title, priority, status } = req.body
        if (title !== undefined) task.title = title
        if (priority !== undefined) task.priority = priority
        if (status !== undefined) task.status = status 
        await task.save()
        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }
        res.status(200).json({ message: 'Task deleted!' })
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router

