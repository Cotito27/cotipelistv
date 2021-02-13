const ctrl = {};

ctrl.index = async (req, res) => {
  let search = req.params.search;
  let videos = await require('../youtube-api').getYoutubeVideos(search);
  let idVideo = videos.items[0].id.videoId;
  res.send(idVideo);
}

module.exports = ctrl;