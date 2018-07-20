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
    const user = UserController.getUserInfo(token)
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
    const user = UserController.getUserInfo(token)
    const logs = await Log.find({userId: user._id})
    ctx.body = {
      status: 1,
      msg: '用户日志获取成功！',
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
    const user = UserController.getUserInfo(token)
    const articles = await Article.find({author: user.name})
    ctx.body = {
      status: 1,
      msg: '该用户文章列表获取成功！',
      data: articles
    }
  }

  static getUserInfo (token) {
    return jsonwebtoken.verify(token.split(' ')[1], secret).data
  }
}

module.exports = UserController
