const pug = require('pug');
const path = require('path');
const Promise = require('bluebird');

// const textTplPath = path.join(__dirname, 'text.pug');
// const imageTplPath = path.join(__dirname, 'image.pug');
// const musicTplPath = path.join(__dirname, 'music.pug');
// const videoTplPath = path.join(__dirname, 'video.pug');
// const voiceTplPath = path.join(__dirname, 'voice.pug');
// const newsTplPath = path.join(__dirname, 'news.pug');

const _factory = (path) => (locals) => new Promise((resolve, reject) => {
    pug.renderFile(path, locals, (err, str) => {
        if (err) reject(err);
        else resolve(str);
    });
});

const render = _factory(path.join(__dirname, 'index.pug'));
// const renderTextTpl = _factory(textTplPath);
// const renderImageTpl = _factory(imageTplPath);
// const renderMusicTpl = _factory(musicTplPath);
// const renderVideoTpl = _factory(videoTplPath);
// const renderVoiceTpl = _factory(voiceTplPath);
// const renderNewsTpl = _factory(newsTplPath);

module.exports = {
    // renderTextTpl,
    // renderImageTpl,
    // renderMusicTpl,
    // renderVideoTpl,
    // renderVoiceTpl,
    // renderNewsTpl
    render
};
// console.log(textTplPath);