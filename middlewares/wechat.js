const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Promise = require('bluebird');
const request = require('superagent');
const { wechatUtils, commonUtils } = require('../utils');
const { wechatModel } = require('../models');
const { renderTextTpl } = require('../templates');
const { weixinService } = require('../services');

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

                ctx.state.message = message;
                // console.log(message);
                let locals = await weixinService.handlerMessage(message);
                let xmlStr = await wechatModel.reply(message, locals);
                console.log(xmlStr);
                ctx.body = xmlStr;
                ctx.status = 200;
                ctx.type = 'application/xml';
            }

            next();
        }
    }
}