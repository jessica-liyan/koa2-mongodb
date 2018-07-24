const Article = require('../model/article')
const Log = require('../model/log')
const authCtrl = require('./UserController')

class ArticleController {
  static async list (ctx) {
    const articles = await Article.find().sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '文章列表获取成功！',
      data: articles
    }
  }

  // 文章详情  id
  static async detail (ctx) {
    const article = await Article.findById(ctx.params.id)
    if(!article){
      ctx.body = {
        status: 0,
        msg: '文章不存在！'
      }
      return
    }
    console.log(article)
    ctx.body = {
      status: 1,
      msg: '文章获取成功！',
      data: article
    }
  }

  // 发布文章  body token
  static async add (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const article = await Article.create(ctx.request.body)
    ctx.body = {
      status: 1,
      msg: '文章添加成功！',
      data: article
    }
    const log = await Log.create({
      type: 'add',
      entry: {
        uid: article._id,
        title: article.title,
        url: `http://localhost:8080/info/post/${article._id}`
      },
      userId: authCtrl.getUserInfo(token)._id
    })
    console.log(log)
  }

  // 更新文章 body token
  static async update (ctx) {
    const token = ctx.header.authorization
    if(!token.length){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const article = await Article.findOne({_id: ctx.request.body._id})
    if(!article){
      ctx.body = {
        status: 0,
        msg: '文章不存在！',
        params: ctx.request.body._id,
        data: article
      }
      return
    }
    Article.update({_id: ctx.request.body._id}, {$set: ctx.request.body}).exec()
    ctx.body = {
      status: 1,
      msg: '文章更新成功！',
      data: article
    }
    const log = await Log.create({
      type: 'update',
      entry: {
        uid: article._id,
        title: article.title,
        url: `http://localhost:8080/info/post/${article._id}`
      },
      userId: authCtrl.getUserInfo(token)._id
    })
    console.log(log)
  }


  // 删除文章 id token
  static async delete (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const article = await Article.deleteOne({_id: ctx.params.id})
    ctx.body = {
      status: 1,
      msg: '文章删除成功！',
      data: article
    }
    const log = await Log.create({
      type: 'delete',
      entry: {
        uid: article._id,
        title: article.title,
        url: `http://localhost:8080/info/post/${article._id}`
      },
      userId: authCtrl.getUserInfo(token)._id
    })
    console.log(log)
  }

  //喜欢文章 文章id   token
  static async like (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    // 喜欢该文章的用户
    const user = authCtrl.getUserInfo(token)
    const article = await Article.findById(ctx.params.id)

    if(ctx.request.method === 'PUT'){
      article.collectionCount = article.collectionCount + 1
      await Log.create({
        type: 'collection',
        entry: {
          uid: article._id,
          title: article.title,
          url: `http://localhost:8080/info/post/${article._id}`
        },
        userId: user._id
      })
    } else if(ctx.request.method === 'DELETE'){
      article.collectionCount = article.collectionCount > 0 ? article.collectionCount - 1 : 0
      await Log.deleteOne({
        'entry.uid': article._id,
        userId: user._id,
        type: 'collection'
      })
    }
    article.save()
    ctx.body = article
  }
}

module.exports = ArticleController
