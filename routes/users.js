const express = require("express")

const routes = express.Router()

const authController = require('../controllers/usersController')
const validateToken = require('../middleware/validateToken')
const validateData = require('../middleware/validateInputs')
const valideLogin = require('../middleware/validateLogin')

// Public
routes.post('/signup', validateData, authController.signup)
routes.post('/login', valideLogin, authController.login)

// Private
routes.get('/me', validateToken, authController.getMyProfile) // Obter usuários adicionados
routes.patch('/me', validateToken, authController.updateMyProfile)
routes.delete('/me', validateToken, authController.deleteMyAccount) // dele user Account

routes.post('/logout', validateToken, authController.logout) // Rota de logout
routes.post('/logoutAll', validateToken, authController.logoutAll) // Rota de logout todas as contas






module.exports = routes