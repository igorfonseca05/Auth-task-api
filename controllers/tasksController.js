const TaskModel = require('../models/taskModel')

exports.createTask = async (req, res) => {
    try {
        const task = new TaskModel(req.body)
        await task.save()

        res.status(200).json({ message: 'Task has been created' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


exports.getAllTask = async (req, res) => {
    try {

        const data = await TaskModel.find(req.params)

        if (!res) {
            throw new Error('No task has been found')
        }

        res.status(200).json({ data })

    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}


exports.getTaskById = async (req, res) => {
    try {
        const id = req.params.id
        const doc = await TaskModel.findById(id)

        if (!doc) {
            throw new Error('Document not found')
        }

        res.status(200).json({ doc })

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


exports.updateTask = async (req, res) => {

    const keys = Object.keys(req.body)
    const existingKey = ['description', 'isCompleted']

    const isValidField = keys.every((field) => existingKey.includes(field))

    if (!isValidField) {
        const error = new Error('unknown field')
        error.status = 404
        throw error
    }

    try {

        const id = req.params.id
        const newData = req.body

        // const doc2 = await TaskModel.findOneAndUpdate(id, newData, { new: true, runValidators: true })
        const doc = await TaskModel.findById(id)

        if (!doc) {
            throw new Error('it was not possible to find the document')
        }

        keys.forEach(field => doc[field] = newData[field])

        await doc.save();

        res.status(200).json({ doc })

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


exports.deleteById = async (req, res) => {
    try {

        const id = req.params.id

        const doc = await TaskModel.findByIdAndDelete(id)

        if (!doc) throw new Error('Doc not found')

        res.status(200).json({ message: 'Data has been deleted', userData: doc })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}