const Promise = require('bluebird');
const xml2js = require('xml2js');
const _ = require('lodash');
module.exports = {
    parseXMLAsync(xml) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xml, {
                trim: true
            }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },
    formatMessage(result) {
        let message = {};
        if (_.isObject(result)) {
            let keys = Object.keys(result);
            // 遍历object的属性
            for (var i = 0; i < keys.length; i++) {
                let key = keys[i];
                let item = result[key];

                if (!(_.isArray(item)) || item.length == 0) continue;

                if (item.length === 1) {
                    let val = item[0];
                    if (_.isObject(val)) {
                        message[key] = formatMessage(val);
                    } else {
                        message[key] = (val || '').trim();
                    }
                } else {
                    message[key] = [];
                    for (let j = 0; j < item.length; j++) {
                        message[key].push(formatMessage(item[j]));
                    }
                }
            }
        }
        return message;
    }
}