const mongoose =  require('mongoose')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true 
  },
  avatar: {
    type: String,
  },
  key: {
    type: String,
  },
  created_at: { 
    type: Date, 
    default: Date.now
  },
  collectedCount: {
    type: Number,
    default: 0
  }
})
const User = mongoose.model('user', userSchema)

module.exports = User