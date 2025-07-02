const validator = require('validator')

function validateLogin(req, res, next) {

    const { email, password } = req.body

    if (!email || !validator.isEmail(email)) {
        return res.status(404).json(response(false, 404, 'Email inválido'))
    }
    if (!password || !validator.isLength(password, { min: 4 })) {
        return res.status(404).json(response(false, 404, 'Password deve conter no minimo 4 caracteres'))
    }

    next()
}

module.exports = validateLogin