const User = require('../model/user')
const Log = require('../model/log')
const Friend = require('../model/friend')

class FriendController {
  // 我的关注列表  id, token
  static async followeeList (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const friends = await Friend.find({followerId: ctx.query.id})
    ctx.body = {
      status: 1,
      msg: '关注用户列表成功！',
      data: friends
    }
  }

  // 我的粉丝列表 id, token
  static async followerList (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const friends = await Friend.find({followeeId: ctx.query.id})
    ctx.body = {
      status: 1,
      msg: '粉丝列表成功！',
      data: friends
    }
  }

  // 添加关注  followeeId   followerId(userId)  token
  static async follow (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const follower = await User.findById(ctx.query.followerId) // 粉丝
    const followee = await User.findById(ctx.query.followeeId) // 被关注人
    follower.followeesCount = follower.followeesCount + 1
    followee.followersCount = followee.followersCount + 1
    follower.save()
    followee.save()

    const friend = await Friend.create({
      followeeId: ctx.query.followeeId,
      followerId: ctx.query.followerId
    });
    friend.follower = follower
    friend.followee = followee
    friend.save()

    await Log.create({
      type: 'follow',
      userId: ctx.query.followerId,
      users: followee
    })

    ctx.body = {
      status: 1,
      msg: '关注用户成功！',
      data: friend
    }
  }

  // 取消关注  followeeId(userId)   followerId  token
  static async unfollow (ctx) {
    const token = ctx.header.authorization
    if(!token){
      ctx.body = {
        status: 0,
        msg: 'token错误！'
      }
      return
    }
    const follower = await User.findById(ctx.query.followerId) // 粉丝
    const followee = await User.findById(ctx.query.followeeId) // 被关注人
    follower.followeesCount = follower.followeesCount > 1 ? follower.followeesCount - 1 : 0
    followee.followersCount = followee.followersCount > 1 ? followee.followersCount - 1 : 0
    follower.save()
    followee.save()

    await Friend.deleteOne({
      followeeId: ctx.query.followeeId,
      followerId: ctx.query.followerId
    })
    ctx.body = {
      status: 1,
      msg: '取消关注用户成功！'
    }
  }
}

module.exports = FriendController
