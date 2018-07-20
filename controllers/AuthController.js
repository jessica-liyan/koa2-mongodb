const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user')
const secret = require('../config').secret

class AuthController {
  static async test (ctx) {
    ctx.body = 'hello'
  }

  static async register(ctx) {
    // 验证码比对
    console.log('验证码', ctx.session)
    const params = ctx.request.body
    console.log(params)
    const user = await User.create({
      name: params.name,
      password: params.password,
      email: params.email,
      avatar: params.avatar
    });
    user.password = bcrypt.hashSync(user.password, 5)
    user.save()
    ctx.body = {
      status: 1,
      msg: '注册成功！',
      data: user
    }
  }

  static async login (ctx) {
    const user = await User.findOne({
      email: ctx.request.body.email
    })
    if (!user) {
      ctx.body = {
        status: 0,
        msg: '用户不存在！',
      }
      return
    }
    const checkPass = bcrypt.compareSync(ctx.request.body.password, user.password)
    if (checkPass) {
      const token = jsonwebtoken.sign({
        data: user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1小时之后过期
      }, secret)
      ctx.body = {
        status: 1,
        msg: '登录成功！',
        data: user,
        token: token
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '密码错误！'
      }
    }
  }

  static async logout (ctx) {
    // 重新生成token
    const token = jsonwebtoken.sign({
      data: {name: 'liyan'},
      exp: 10
    }, secret)
    ctx.body = {
      status: 1,
      msg: '成功退出！'
    }
  }
}

module.exports = AuthController
