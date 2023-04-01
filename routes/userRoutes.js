const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

router
  .get('/', authController.listAllUsers)
  .post('/signup', authController.signUp)
  .get('/login', authController.login)

module.exports = router