const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user')
const Log = require('../model/log')
const Article = require('../model/article')
const secret = require('../config').secret

class UserController {
  // 用户列表
  static async list (ctx) {
    const users = await User.find();
    ctx.body = {
      status: 1,
      msg: '获取用户列表成功！',
      data: users
    }
  }

  // 用户个人信息 /user  token
  static getSelf (ctx) {
    ctx.body = {
      status: 1,
      msg: 'success',
      data: ctx.state.user
    }
  }

  // 我的资料 user/:id  token
  static async info (ctx) {
    let user = await User.findById(ctx.params.id)
    ctx.body = {
      status: 1,
      msg: '用户信息获取成功！',
      data: user
    }
  }

  // 我的动态 user/:id/log  token
  static async log (ctx) {
    const logs = await Log.find({userId: ctx.params.id}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '用户日志获取成功！',
      data: logs
    }
  }

  // 我的喜欢 user/:id/like  token
  static async like (ctx) {
    const logs = await Log.find({userId: ctx.params.id, type: 'collection'}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '用户喜欢列表获取成功！',
      data: logs
    }
  }

  // 我的发布 user/:id/post token
  static async post (ctx) {
    const articles = await Article.find({'authorId': ctx.params.id}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '该用户文章列表获取成功！',
      data: articles
    }
  }

  // 更新用户资料 user/update   token
  static async update (ctx) {
    const user = await User.findOne({_id: ctx.request.body._id})
    if(!user){
      ctx.body = {
        status: 0,
        msg: '用户不存在！'
      }
      return
    }
    User.update({_id: ctx.request.body._id}, {$set: ctx.request.body}).exec()
    ctx.body = {
      status: 1,
      msg: '用户资料更新成功！'
    }
  }

  static getUserInfo (token) {
    return jsonwebtoken.verify(token, secret).data
  }
}

module.exports = UserController
