const userCtrl = require('./UserController')
const Comment = require('../model/comment')
const Article = require('../model/article')

class CommentController {
  // 发表评论  {文章id(targetId) parentId content}  token
  static async add (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    // 评论者
    const user = userCtrl.getUserInfo(token)
    // 评论的文章
    const article = await Article.findById(ctx.request.body.targetId)

    // comments表新增一条记录
    const comment = await Comment.create({
      targetId: ctx.request.body.targetId,
      content: ctx.request.body.content,
      parentId: ctx.request.body.parentId,
      userId: user._id, // 评论人
      userInfo: user,
      respUserId: article.author._id, // 原作者
      respUserInfo: article.author,
    })
    // article表的评论统计数加1
    article.commentsCount = article.commentsCount + 1
    article.save()

    ctx.body = {
      status: 1,
      msg: 'success',
      data: comment
    }
  }

  // 获取评论列表   params.id  token
  static async fetch (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const comments = await Comment.find({targetId: ctx.params.id}).sort({created_at: -1})
    console.log('获取列表', getTrees(comments, ''))
    ctx.body = {
      status: 1,
      msg: 'success',
      data: getTrees(comments, '')
    }
  }
}

module.exports = CommentController

function getTrees(list, parentId) {
  let items = {};
  for (let i = 0; i < list.length; i++) {
      let key = list[i].parentId;
      if (items[key]) {
          items[key].push(list[i]);
      } else {
          items[key] = [];
          items[key].push(list[i]);
      }
  } 
  return formatTree(items, parentId);
}

function formatTree(items, parentId) {
  let result = [];
  if (!items[parentId]) {
      return result;
  }
  for (let t of items[parentId]) {
      t.children = formatTree(items, t._id)
      result.push(t);
  }
  return result;
}
