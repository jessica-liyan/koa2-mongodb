const User = require('../model/user')
const Log = require('../model/log')
const Friend = require('../model/friend')

class FriendController {
  // 我的关注列表 /followeeList/id   token
  static async followeeList (ctx) {
    const friends = await Friend.find({followerId: ctx.params.id})
    ctx.body = {
      status: 1,
      msg: '关注用户列表成功！',
      data: friends
    }
  }

  // 我的粉丝列表 /followerList/id    token
  static async followerList (ctx) {
    const friends = await Friend.find({followeeId: ctx.params.id})
    ctx.body = {
      status: 1,
      msg: '粉丝列表成功！',
      data: friends
    }
  }

  // 判断是否有关注关系 /isFollowed?followeeId & followerId   token
  static async isFollowed (ctx) {
    const friend = await Friend.findOne({ // 返回的是单个对象或null
      followeeId: ctx.query.followeeId,
      followerId: ctx.query.followerId
    });
    if(friend){
      ctx.body = {
        status: 1,
        msg: 'ok',
        data: {
          isFollowed: true
        }
      }
    } else {
      ctx.body = {
        status: 1,
        msg: 'ok',
        data: {
          isFollowed: false
        }
      }
    }
  }

  // 添加关注  /follow?followeeId & followerId(userId)   token
  static async follow (ctx) {
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

  // 取消关注  /unfollow ? followeeId(userId) & followerId   token
  static async unfollow (ctx) {
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
