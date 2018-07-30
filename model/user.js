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
  job: { // 职位
    type: String
  },
  company: { // 公司
    type: String
  },
  selfDesc: { // 个人介绍
    type: String
  },
  selfPage: { // 个人主页
    type: String
  },
  followeesCount: { // 关注
    type: Number,
    default: 0
  },
  followersCount: { // 粉丝
    type: Number,
    default: 0
  },
  totalLikesCount: { // 文章获得的赞
    type: Number,
    default: 0
  },
  totalViewsCount: { // 文章点击量
    type: Number,
    default: 0
  },
  key: {
    type: String,
  },
  created_at: { 
    type: Date, 
    default: Date.now
  }
})
const User = mongoose.model('user', userSchema)

module.exports = User