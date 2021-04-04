const ctrl = {};
const fetch = require('node-fetch');
const FormData = require('form-data');

const puppeteer = require('puppeteer-extra');
const Movie = require('../models/Movie.model');

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin());

async function getVideoUrl(url) {
  const browser = await puppeteer.launch({ headless: true,args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  await page.goto(url);
  await page.click('#loading > div > svg');

  // await page.evaluate(() => {
  //   const myConfirm = document.querySelector('.myConfirm');
  //   if(myConfirm) {
  //     await page.click('#resume_no');
  //   }
  // });

  await page.waitForSelector('#vstr > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video');

  let video = await page.evaluate(async () => {
    let videoElement = document.querySelector('#vstr > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video');
    if(videoElement) {
      return videoElement.src;
    } else {
      return '';
    }
  });
  await page.goto(video);
  await page.waitFor(2000);
  await browser.close();
  return video;
}

async function downloadVideo(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let urlDownload = url;

  await page.goto('https://tool.baoxinh.com/fembed.cg');
  await page.type('#input', urlDownload);
  await page.click('#btnAct');
  
  // await page.click('#loading > div > svg');

  // await page.evaluate(() => {
  //   const myConfirm = document.querySelector('.myConfirm');
  //   if(myConfirm) {
  //     await page.click('#resume_no');
  //   }
  // });

  await page.waitForSelector('.btn-download-gg');

  let enlace = await page.evaluate(async () => {
    let enlaceElement = document.querySelectorAll('.btn-download-gg');
    let enlaces = [];
    enlaceElement.forEach((item) => {
      if(!item.href.includes('skachat')) {
        enlaces.push({
          url: item.href,
          quality: item.querySelector('b').textContent.trim().split(' ').pop().replace('p', '')
        });
      }
    });
    // if(enlaceElement) {
    //   return enlaceElement.href;
    // } else {
    //   return '';
    // }
    return enlaces;
  });
  // await page.goto(video);
  // console.log(enlace);

  await browser.close();
  return enlace;
}

ctrl.index = async (req, res) => {
 let idVideo = req.params.id || '6zk7qs035-ykke-';
 let imageExtra = req.query.image;
 let targetVideoExtend = await Movie.findOne({imageExtra});
 let value = await getVideoUrl(`https://pelisplushd.me/v/${idVideo}`).catch((err) => {
   return res.render('videoStream', {
     id: idVideo,
     title: 'CotiPelisTV',
     imageExtra,
     error: true,
     target: targetVideoExtend.titleDownload,
     infoError: err
   })
 });
 res.render('videoStream', {
    id: idVideo,
    title: 'CotiPelisTV',
    videoSrc: value,
    imageExtra,
    error: false
  });
//  console.log(value);
}

ctrl.download = async (req, res) => {
  let idVideo = req.params.id || '6zk7qs035-ykke-';
  let imageExtra = req.query.image;
  let targetVideoExtend = await Movie.findOne({imageExtra});
  let value = await downloadVideo(`https://femax20.com/v/${idVideo}`).catch((err) => {
    return res.render('videoStream', {
      id: idVideo,
      title: 'CotiPelisTV',
      imageExtra,
      error: true,
      target: targetVideoExtend.titleDownload,
      infoError: err
    })
  });
  res.render('videoStream', {
     id: idVideo,
     title: 'CotiPelisTV',
     videoSrc: value,
     imageExtra,
     error: false
   });
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