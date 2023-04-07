const mongoose = require('mongoose')

mongoose.connect('mongodb://sanjeev:mypassword@172.18.0.5:27017/testMongoose?authSource=admin')

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number
})

const User = mongoose.model('User', UserSchema)

async function run() {
  const user = await User.create({name:'Kyle', age:26})
  user.name = 'Sally'
  await user.save()
  console.log(user);
}

(async () => await run())()