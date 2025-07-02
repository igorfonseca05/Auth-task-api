const response = require('../utils/response')

function validateFields(req, res, next) {
    const { description, isCompleted } = req.body

    if (!description || typeof description !== 'string' || description.length <= 2) {
        return res.status(404).json(response(false, 404, 'Campo não enviado ou inválido'))
    }

    if (typeof isCompleted !== 'boolean') {
        return res.status(404).json(response(false, 404, 'Campo não enviado ou inválido(boolean)'))
    }

    next()
}

module.exports = validateFields
