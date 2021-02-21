const ctrl = {};
const fetch = require('node-fetch');

ctrl.index = async (req, res) => {
 let idVideo = req.params.id || 'e2xr0h-xe5y8wed';
 let imageExtra = req.query.image;
 let response = await fetch(`https://pelisplushd.me/api/source/${idVideo}`, {
  method: 'POST',
  // headers: {
  //   'accept': '*/*',
  //   'accept-encoding': 'gzip, deflate, br',
  //   'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
  //   'cache-control': 'max-age=0',
  //   'cookie': '_ym_d=1613091004; _ym_uid=16130910041012178984; __cfduid=da51dec3244cac02dc5861dd86e7c0a2c1613097690; _ym_isad=1',
  //   'referer': 'https://pelisplushd.net/',
  //   'sec-fetch-dest': 'document',
  //   'sec-fetch-mode': 'navigate',
  //   'sec-fetch-site': 'same-origin',
  //   'sec-fetch-user': '?1',
  //   'upgrade-insecure-requests': '1',
  //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36'
  // }
 });
 let value = await response.json();
//  res.json(value);
res.render('videoStream', {
  id: idVideo,
  title: 'CotiPelisTV',
  videoSrc: value,
  imageExtra
})
//  console.log(value);
}

ctrl.getUrl = async (req, res) => {
  let idVideo = req.params.id || 'e2xr0h-xe5y8wed';
  let response = await fetch(`https://pelisplushd.me/api/source/${idVideo}`, {
    method: 'POST',
    // headers: {
    //   'accept': '*/*',
    //   'accept-encoding': 'gzip, deflate, br',
    //   'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
    //   'cache-control': 'max-age=0',
    //   'cookie': '_ym_d=1613091004; _ym_uid=16130910041012178984; __cfduid=da51dec3244cac02dc5861dd86e7c0a2c1613097690; _ym_isad=1',
    //   'referer': 'https://pelisplushd.net/',
    //   'sec-fetch-dest': 'document',
    //   'sec-fetch-mode': 'navigate',
    //   'sec-fetch-site': 'same-origin',
    //   'sec-fetch-user': '?1',
    //   'upgrade-insecure-requests': '1',
    //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36'
    // }
  });
  let value = await response.json();
  res.json({
    videoSrc: value
  });
}

module.exports = ctrl;