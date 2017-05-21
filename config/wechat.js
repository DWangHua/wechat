const path = require('path');
const {wechatUtils} = require('../utils');
const accessTokenFilePath = path.join(__dirname, 'wechat_access_token.txt');
module.exports = {
    appID: 'wxd421899cf544a5dd',
    appSecret: '8c425e1108c8d46b41dd3b7afd53f1e0',
    token: '18915636179wangfanhua',
    getAccessToken() {
        return wechatUtils.readFileAsync(accessTokenFilePath, 'utf8');
    },
    saveAccessToken(data) {
        return wechatUtils.writeFileAsync(accessTokenFilePath, data, 'utf8');
    }
}