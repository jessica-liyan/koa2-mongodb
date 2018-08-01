const mongoose =  require('mongoose')
const articleSchema = new mongoose.Schema({
  type: { // 关注用户(follow)  文章发表(add)  文章更新(update)  喜欢文章(collection) 
    type: String,
    required: true 
  },
  entry: {
    type: Object
  },
  users: {
    type: Array,
  },
  tags: {
    type: Array,
  },
  userId: {
    type: String,
    required: true 
  },
  created_at: {
    type: Date, 
    default: Date.now
  },
})
const Log = mongoose.model('log', articleSchema)

module.exports = Log