const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const config = require('./config')
const session = require('koa-session2')

const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 连接数据库
const connect = require('./mongodb')
connect()

// 跨域
app.use(cors())
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制，默认2M
  }
}))

// session
app.use(session({
  key: "SESSIONID"
}));

// 
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('错误啦', err)
    ctx.status = err.status || 500;
    ctx.body = {
      status: 0,
      msg: err.message
    };
    ctx.app.emit('error', err, ctx);
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        status: 0,
        error: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  }
});

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
