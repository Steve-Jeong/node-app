const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res) => {
  const {username, password} = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      username,
      password: hashedPassword
    })
    console.log('newUser : ', newUser);
    req.session.user = newUser
    res.status(201).json({
      status : 'success',
      data : {
        user: newUser
      }
    })
  } catch(e) {
    res.status(400).json({
      status: 'fail',
      error: e
    })
  }
}

exports.login = async (req, res) => {
  const {username, password} = req.body
  try {
    const user = await User.findOne({username})
    if(!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found'
      })
    }

    if(await bcrypt.compare(password, user.password)) {
      req.session.user = user
      res.status(200).json({
        status: 'success login',
      })
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'incorrect password'
      })
    }

  } catch(e) {
    res.status(400).json({
      status: 'fail',
      error: e
    })
  }
}

exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    })
  } catch(e) {
    res.status(400).json({
      status: 'fail'
    })
  }
}

exports.logout = (req, res) => {
  if(req.session.user) req.session.user = null
  res.status(200).json({
    status: 'success',
    message: 'successfully logged out'
  })
}