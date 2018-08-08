const Message = require('../model/message')

class MessageController {
  // 发送消息   /message  {from, to, content, type}   token
  static async send (ctx) {
    const msg = await Message.create(ctx.request.body)
    ctx.response.body = {
      status: 1,
      msg: 'ok！',
      data: msg
    }
  }

  // 获取历史消息列表 /message/list   {from to}  token
  static async  list(ctx) {
    console.log('socketaaaa', ctx.socket.request)

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
    // const msg = await Message.aggregate([
    //   {"$match": {to: ctx.params.id}},
    //   {"$group": {
    //     "to": "$to"
    //   }}
    // ])
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
}

module.exports = MessageController