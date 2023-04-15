if(process.env.NODE_ENV==='development') 
  require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET} = require('./config/config')


const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')


const app = express()
app.use(express.json())

const {createClient} = require('redis')

let redisClient = createClient({url:REDIS_URL})


async function connect() {
  redisClient.on('error', err => console.log('Redis Client Error', err));
  redisClient.on('ready', () => console.log('Redis is ready to use'));
  
  await redisClient.connect().catch(console.error)
  
  await redisClient.set('my_key', 'my value');
  const value = await redisClient.get('my_key');
  console.log('my_key : ', value)
}
connect()

const session = require('express-session')
let RedisStore = require("connect-redis").default
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

app.use(session({
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sessionId",  // nodejs를 쓰면 session id이름이 connect.id인데 이를 일반적인 이름으로 바꾸어서 해커 공격으로 부터 보호한다.
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 30*1000    // 30 seconds
  }
}))


app.use(express.json())

const connectWithRetry =  () => {
  mongoose
    .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/newTest?authSource=admin`)
    .then(()=>console.log("successfully connected to MongoDB"))
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
app.use('/api/v1/users', userRouter)


const PORT = process.env.PORT || 3001
console.log('PORT : ', PORT)
app.listen(PORT, console.log(`server is listening on port http://localhost:${PORT}`))