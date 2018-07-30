const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user')
const Log = require('../model/log')
const Article = require('../model/article')
const secret = require('../config').secret

class UserController {
  static async list (ctx) {
    const users = await User.find();
    ctx.body = {
      status: 1,
      msg: '获取用户列表成功！',
      data: users
    }
  }

  // 我的资料 token
  static async info (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    let user = await User.findById(ctx.params.id)
    ctx.body = {
      status: 1,
      msg: '用户信息获取成功！',
      data: user
    }
  }

  // 我的动态 token
  static async log (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const logs = await Log.find({userId: ctx.params.id}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '用户日志获取成功！',
      data: logs
    }
  }

  // 我的喜欢 token
  static async like (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const logs = await Log.find({userId: ctx.params.id, type: 'collection'}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '用户喜欢列表获取成功！',
      data: logs
    }
  }

  // 我的发布 token
  static async post (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const articles = await Article.find({'authorId': ctx.params.id}).sort({created_at: -1})
    ctx.body = {
      status: 1,
      msg: '该用户文章列表获取成功！',
      data: articles
    }
  }

  static getSelf (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    ctx.body = {
      status: 1,
      msg: 'success',
      data: UserController.getUserInfo(token)
    }
  }

  // 更新用户资料 body token
  static async update (ctx) {
    const token = ctx.header.authorization
    if(!token.length){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
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
    return jsonwebtoken.verify(token.split(' ')[1], secret).data
  }
}

module.exports = UserController
