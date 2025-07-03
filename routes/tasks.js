const express = require("express")

const routes = express.Router()

const validateFields = require('../middleware/tasksValidate')
const validateToken = require('../middleware/validateToken')

const {
    createTask,
    getTaskById,
    getAllTask,
    updateTask,
    deleteById } = require('../controllers/tasksController')

// Route to create a task
routes.post('/', validateFields, validateToken, createTask)

// Routes to get all tasks
routes.get('/', validateToken, getAllTask)

// Routes to get a specific task by id
routes.get('/:id', validateToken, getTaskById)

// Routes to modify task
routes.patch('/:id', validateToken, updateTask)

// Routes to delete a task by its ID
routes.delete('/:id', validateToken, deleteById)


module.exports = routes