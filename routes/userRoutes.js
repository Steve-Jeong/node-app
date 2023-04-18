const express = require('express')
const {listAllUsers, signUp, login, logout} = require('../controllers/authController')

const router = express.Router()

router
  .get('/', listAllUsers)
  .post('/signup', signUp)
  .post('/login', login)
  .post('/logout', logout)

module.exports = router