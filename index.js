if(process.env.NODE_ENV==='development') 
  require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', (req, res)=>{
  res.send('<h1>Hello World!! - Steve Jeong</h1>')
})

const PORT = process.env.PORT || 3001
console.log('PORT : ', PORT)
app.listen(PORT, console.log(`server is listening on port http://localhost:${PORT}`))