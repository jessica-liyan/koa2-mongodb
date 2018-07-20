const mongoose =  require('mongoose')
const articleSchema = new mongoose.Schema({
  type: { // collection(收藏)  follow(关注)   发表(add) 编辑(edit)  删除(del)   
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