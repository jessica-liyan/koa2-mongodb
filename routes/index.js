const router = require('koa-router')()
const authctrl = require('../controllers/AuthController') 
const userctrl = require('../controllers/UserController') 
const captchactrl = require('../controllers/CaptchaController') 
const uploadctrl = require('../controllers/UploadController') 
const articlectrl = require('../controllers/ArticleController') 
const commentctrl = require('../controllers/CommentController') 
const friendctrl = require('../controllers/FriendController') 
const msgctrl = require('../controllers/MessageController') 

const {isAuthenticated} = require('../config/passport')

router
  .get('/', authctrl.test) // 测试
  .post('/register', authctrl.register)
  .post('/login', authctrl.login)
  .get('/captcha', captchactrl.fetch)
  .post('/upload', uploadctrl.upload)
  .get('/logout', isAuthenticated(), authctrl.logout)
  .get('/user', isAuthenticated(), userctrl.getSelf)
  .get('/user/list', isAuthenticated(), userctrl.list)
  .post('/user/update', isAuthenticated(),userctrl.update)
  .get('/user/:id', isAuthenticated(), userctrl.info)
  .get('/user/:id/post', isAuthenticated(), userctrl.post)
  .get('/user/:id/log', isAuthenticated(), userctrl.log)
  .get('/user/:id/like', isAuthenticated(), userctrl.like)
  .get('/notification/:id', isAuthenticated(), userctrl.notification)
  .get('/getNotificationNum/:id', isAuthenticated(), userctrl.getNotificationNum)
  .get('/article', articlectrl.list)
  .get('/article/:type', articlectrl.list)
  .get('/article/detail/:id', articlectrl.detail)
  .post('/article/add', isAuthenticated(), articlectrl.add)
  .post('/article/update', isAuthenticated(), articlectrl.update)
  .get('/article/delete/:id', isAuthenticated(), articlectrl.delete)
  .put('/article/like/:id', isAuthenticated(), articlectrl.like)
  .delete('/article/like/:id', isAuthenticated(), articlectrl.like)
  .post('/comment', isAuthenticated(), commentctrl.comment)
  .get('/comment/:id', commentctrl.fetch)
  .get('/follow', isAuthenticated(), friendctrl.follow)
  .get('/unfollow', isAuthenticated(), friendctrl.unfollow)
  .get('/followeeList/:id', isAuthenticated(), friendctrl.followeeList)
  .get('/followerList/:id', isAuthenticated(), friendctrl.followerList)
  .get('/isFollowed', isAuthenticated(), friendctrl.isFollowed)
  .post('/message', isAuthenticated(), msgctrl.send)
  .post('/message/list', isAuthenticated(), msgctrl.list)
  .get('/message/:id', isAuthenticated(), msgctrl.friends)

module.exports = router
