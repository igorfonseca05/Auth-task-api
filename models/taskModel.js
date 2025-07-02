const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        validate(description) {
            if (!description) {
                throw new Error('Description is required')
            }
        }
    },
    isCompleted: {
        type: Boolean,
        required: true
    }
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // }
})

const TaskModel = mongoose.model('task', taskSchema)

module.exports = TaskModel