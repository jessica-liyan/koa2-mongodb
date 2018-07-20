const router = require('koa-router')()
const authctrl = require('../controllers/AuthController') 
const userctrl = require('../controllers/UserController') 
const captchactrl = require('../controllers/CaptchaController') 
const uploadctrl = require('../controllers/UploadController') 
const articlectrl = require('../controllers/ArticleController') 

router
  .get('/', authctrl.test)
  .post('/register', authctrl.register)
  .post('/login', authctrl.login)
  .get('/logout', authctrl.logout)
  .get('/user', userctrl.list)
  .get('/user/info', userctrl.info)
  .get('/user/post', userctrl.post)
  .get('/user/log', userctrl.log)
  .get('/captcha', captchactrl.fetch)
  .post('/upload', uploadctrl.upload)
  .get('/article', articlectrl.list)
  .get('/article/:id', articlectrl.detail)
  .post('/article/add', articlectrl.add)
  .post('/article/update', articlectrl.update)
  .get('/article/delete/:id', articlectrl.delete)

module.exports = router