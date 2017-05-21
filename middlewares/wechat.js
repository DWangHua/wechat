const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Promise = require('bluebird');
const request = require('superagent');
const { wechatUtils, commonUtils } = require('../utils');
const { wechatModel } = require('../models');
const {renderTextTpl} = require('../templates');

module.exports = (opts = {}) => {
    wechatModel.init(opts);
    return async(ctx, next) => {
        // 验证开发者身份
        let token = opts.token,
            signature = ctx.query.signature,
            nonce = ctx.query.nonce,
            timestamp = ctx.query.timestamp,
            echostr = ctx.query.echostr;
        let str = [token, timestamp, nonce].sort().join('');
        let sha = sha1(str);
        if (ctx.method.toLowerCase() === 'get') {
            if (sha === signature) {
                ctx.body = echostr + '';
            } else {
                ctx.body = 'wrong';
            }
        } else if (ctx.method.toLowerCase() === 'post') {
            // 处理post请求
            if (sha !== signature) {
                ctx.body = 'wrong';
                return false;
            } else {
                let rawXmlBody = await getRawBody(ctx.req, {
                    length: ctx.request.length,
                    limit: '2mb',
                    encoding: ctx.request.charset || 'utf8'
                });

                // 解析xml To Js
                let parsedXml = await commonUtils.parseXMLAsync(rawXmlBody);
                // 格式化 Js
                let message = await commonUtils.formatMessage(parsedXml.xml);

                console.log(message);
                if (message.MsgType === 'event') {
                    if (message.Event === 'subscribe') {
                        // 时间戳直接在模板中构建
                        // let now = (new Date()).getTime();
                        // 获取自动回复的xml
                        let result = await renderTextTpl({
                            info: message,
                            extra: {
                                content: 'hello 订阅者'
                            }
                        });
                        // console.log(result);
                        ctx.body = result;
                        return;
                    }
                }
            }

            next();
        }
    }
}