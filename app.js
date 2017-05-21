const Koa = require('koa');
const logger = require('koa-logger');
const app = new Koa();
const {wechatConfig} = require('./config');
// const wechatHandle = require('./middlewares');

const {wecahtMiddleWare} = require('./middlewares');
app.use(logger());
app.use(wecahtMiddleWare(wechatConfig));

app.listen(9000);
console.log('app is listening on 9000');
