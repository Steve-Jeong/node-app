if(process.env.NODE_ENV==='development') 
  require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT} = require('./config/config')

const postRouter = require('./routes/postRoutes')
const app = express()

app.use(express.json())

const connectWithRetry =  () => {
  mongoose
    .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    .then(()=>console.log("successfully connected to DB"))
    .catch((e)=>{
      console.log(e)
      setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

app.get('/', (req, res)=>{
  res.send('<h1>Hello World!!</h1>')
})

app.use('/api/v1/posts', postRouter)

const PORT = process.env.PORT || 3001
console.log('PORT : ', PORT)
app.listen(PORT, console.log(`server is listening on port http://localhost:${PORT}`))