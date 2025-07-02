
// Modelo de resposta padrão
function response(success = null, statusCode = null, message = null, user) {

    if (user?.toJSON) {
        user = user.toJSON()
    }

    return {
        success,
        statusCode,
        message,
        ...(user && { user }),
    }
}

module.exports = response