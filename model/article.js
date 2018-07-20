const mongoose =  require('mongoose')
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true 
  },
  author: {
    type: String,
    required: true 
  },
  classify: {
    type: String,
  },
  tag: {
    type: String,
  },
  created_at: { 
    type: Date, 
    default: Date.now
  },
})
const Article = mongoose.model('article', articleSchema)

module.exports = Article