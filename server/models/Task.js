const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium'
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {timestamps: true}
)


module.exports = mongoose.model('Task', taskSchema)