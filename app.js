
const express = require('express')
const cors = require('cors')
const dbConnect = require('./db/dbConnection')
const routes = require('./routes/routes')

const app = express()

dbConnect()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true
}))

app.use(routes)

module.exports = app