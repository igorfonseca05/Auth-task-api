const validator = require('validator')
const response = require('../utils/response')

function validateData(req, res, next) {
    const { name, email, password } = req.body

    if (!name || name.length <= 2) {
        return res.status(404).json(response(false, 404, 'O nome deve conter no mínimo 2 caracteres'))
    }

    if (!email || !validator.isEmail(email)) {
        return res.status(404).json(response(false, 404, 'Email inválido'))
    }
    if (!password || !validator.isLength(password, { min: 6 })) {
        return res.status(404).json(response(false, 404, 'Password deve conter no minimo 6 caracteres'))
    }

    next()
}

module.exports = validateData