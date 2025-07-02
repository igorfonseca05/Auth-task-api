const jwt = require('jsonwebtoken')
const response = require('../utils/response')
const userModel = require('../models/userModel')


async function validateToken(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer', '').trim()
        if (!token) throw new Error('Unauthorized')

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) throw new Error('Invalid or expired token')

        const user = await userModel.findOne({ _id: decoded.id, 'tokens.token': token })
        if (!user) throw new Error('User not found, verify the token sent')

        req.token = token
        req.user = user

        next()
    } catch (error) {
        res.status(401).json(response(false, 401, error.message))
    }
}

module.exports = validateToken

