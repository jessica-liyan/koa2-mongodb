const mongoose =  require('mongoose')
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  targetId: { // 文章id
    type: String,
    default: ''
  },
  parentId: { // 子评论父级id
    type: String,
    default: ''
  },
  userId: { // 评论人的id
    type: String,
    required: true 
  },
  userInfo: { // 评论人信息
    type: Object,
  },
  children: { // 子评论数组
    type: Array,
  },
  created_at: {
    type: Date, 
    default: Date.now
  },
})
const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment