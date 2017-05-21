const path = require('path');
const renders = require('../templates');
const { wechatModel } = require('../models');
exports.handlerMessage = async (message = {}) => {
    // console.log('ccc');
    let locals = null;
    const { 
        MsgType : msgType = '',
        Event: event = '',
        EventKey: eventKey = '',
        ticket = '',
        Latitude: lat = '',
        Longitude: lot = '',
        Precision: pre = ''
    } = message;
    // console.log(message);
    if (msgType === 'event') {
        if (event === 'subscribe') {
            if (eventKey) {
                console.log(`扫描二维码进来的 ${eventKey} ${ticket}`);
            }
            locals = {
                type: 'text',
                extra: {
                    content: '你鼎业了个号'
                }
            };
            // ctx.body = await renders.renderTextTpl({
                
            // });
        } else if (event === 'unsubscribe') {
            console.log('取消关注');
        } else if (event === 'LOCATION') {
            locals = {
                type: 'text',
                extra: {
                    content: `位置${lat}--${log}--${pre}`
                }
            };
        } else if (event === 'CLICK') {
            locals = {
                type: 'text',
                extra: {
                    content: `你点击的菜单${eventKey}`
                }
            };
        } else if (event === 'SCAN') {
            console.log(`关注后扫二维码${eventKey}--${ticket}`);
            locals = {
                type: 'text',
                extra: {
                    content: '你点击了菜单'
                }
            };
        } else if (event === 'VIEW') {
            locals = {
                type: 'text',
                extra: {
                    content: '你点击了菜单中的链接' + eventKey
                }
            };
        }
    } else if (msgType === 'text') {
        let content = message.Content;
        let defaultContent = `太复杂了:${content}`;
        locals = {
            type: 'text'
        };
        if (content === '1') {
            locals = Object.assign(locals, {
                extra: {
                    content: '第一'
                }
            });
            // console.log(locals);
        } else if (content === '2') {
            locals = Object.assign(locals, {
                extra: {
                    content: 'dier'
                }
            });
        } else if (content === '3') {
            locals = Object.assign(locals, {
                extra: {
                    content: '第三'
                }
            });
        } else if (content === '4') {
            locals = {
                type: 'news',
                extra: [
                    {
                        title: '图文消息',
                        desc: '这是一则图文消息',
                        picUrl: 'https://placeholdit.imgix.net/~text?txtsize=34&bg=ff00ff&txtclr=00ff00&txt=360%C3%97200&w=360&h=200',
                        url: 'https://www.baidu.com/'
                    },
                    {
                        title: '第二',
                        desc: '这是第二则',
                        picUrl: 'https://placeholdit.imgix.net/~text?txtsize=34&bg=ff00ff&txtclr=00ff00&txt=200%C3%97200&w=200&h=200',
                        url: 'https://mp.weixin.qq.com/wiki'
                    }
                ]
            };
        } else if (content === '5') {
            let response = await wechatModel.uploadMeterial('image', path.join(__dirname, '../meterial', 'big.png'));
            // console.log(data.text);
            // console.log(response);
            // console.log(response.body);
            let data = JSON.parse(response.text);
            // console.log(data);
            locals = {
                type: 'image',
                extra: {
                    mediaId: data.media_id
                }
            };
        } else if (content === '6') {
            let response = await wechatModel.uploadMeterial('video', path.join(__dirname, '../meterial', '6.mp4'));
            let data = JSON.parse(response.text);
            locals = {
                type: 'video',
                extra: {
                    mediaId: data.media_id,
                    title: '一则小饰品',
                    desc: '吼吼吼'
                }
            };
        }
    }

    return locals;
}