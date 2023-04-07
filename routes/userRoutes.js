const express = require('express')
const {listAllUsers, signUp, login} = require('../controllers/authController')

const router = express.Router()

router
  .get('/', listAllUsers)
  .post('/signup', signUp)
  .post('/login', login)

module.exports = router