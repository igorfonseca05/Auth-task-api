const express = require("express")

const routes = express.Router()

const validateFields = require('../middleware/tasksValidate')

const {
    createTask,
    getTaskById,
    getAllTask,
    updateTask,
    deleteById } = require('../controllers/tasksController')

// Route to create a task
routes.post('/', validateFields, createTask)

// Routes to get all tasks
routes.get('/', getAllTask)

// Routes to get a specific task by id
routes.get('/:id', getTaskById)

// Routes to modify task
routes.patch('/:id', updateTask)

// Routes to delete a task by its ID
routes.delete('/:id', deleteById)


module.exports = routes