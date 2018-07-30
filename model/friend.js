const mongoose =  require('mongoose')
const friendSchema = new mongoose.Schema({
  followeeId: { // 被关注方
    type: String,
    required: true 
  },
  followee: { // 被关注方的信息
    type: Object,
  },
  followerId: {  // 粉丝
    type: String,
    required: true 
  },
  follower: { // 粉丝信息
    type: Object,
  },
  created_at: { 
    type: Date, 
    default: Date.now
  }
})
const Friend = mongoose.model('friend', friendSchema)

module.exports = Friend