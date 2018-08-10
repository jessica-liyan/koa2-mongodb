const Message = require('../model/message')
const Group = require('../model/group')

class MessageController {
  // 获取历史消息列表 /message/list   {from to}  token
  static async  messageList(ctx) {
    const msg = await Message.find({
      $or: [
        {to: ctx.request.body.to, from: ctx.request.body.from},
        {from: ctx.request.body.to, to: ctx.request.body.from}
      ]
    }).populate({ path: 'to', select: 'name avatar'}).populate({ path: 'from', select: 'name avatar'})
    ctx.body = {
      status: 1,
      msg: 'ok！',
      data: msg
    }
  }

  // 获取当前用户的聊天好友列表 /message/:id  token
  static async friends(ctx){
    const msg = await Message.find({to: ctx.params.id}, 'from').populate({ path: 'from', select: 'name avatar'})

    var friends = [];
    msg.forEach(function(item){
      friends.includes(item) ? '' : friends.push(item);
    })

    ctx.body = {
      status: 1,
      msg: 'ok！',
      data: friends
    }
  }

  // 所有群组列表
  static async groupList (ctx) {
    const groups = await Group.find()
    ctx.body = {
      status: 1,
      msg: '群组列表获取成功！',
      data: groups
    }
  }
}

module.exports = MessageController