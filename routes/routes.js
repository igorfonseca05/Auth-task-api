const express = require("express")

const routes = express.Router()

const tasks = require('./tasks')
const users = require('./users')

routes.use('/api/users', users)
routes.use('/api/tasks', tasks)

module.exports = routes