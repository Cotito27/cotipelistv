const ctrl = {};
const WatchList = require('../models/WatchList.model');

ctrl.index = async (req, res) => {
  let user = req.user;
  let perPage = 24;
  let page = req.params.page || 1;
  WatchList.find({ user_id: req.user.id })
  .skip((perPage * page) - perPage)
  .limit(perPage).exec((err, watchs) => {
    WatchList.countDocuments({ user_id: req.user.id },(err, count) => {
      // console.log(count, Math.ceil(count / perPage));
      if(err) return next(err);
      res.render('index', {
        title: 'CotiPelisTV',
        movies: watchs,
        section: 'Peliculas y Series',
        currentPage: page,
        pages: Math.ceil(count / perPage),
        pagesInactive: false,
        videoStream: false,
        genreIndicate: true,
        genero: false,
        titleSearch: false,
        yearActive: false,
        user,
      });
    })
  });
 

}

ctrl.findMyList = async (req, res) => {
  let user = req.user;
  let perPage = 24;
  let page = req.params.page || 1;
  WatchList.find({ user_id: req.user.id })
  .skip((perPage * page) - perPage)
  .limit(perPage).exec((err, watchs) => {
    WatchList.countDocuments({ user_id: req.user.id },(err, count) => {
      if(err) return next(err);
      res.json({
        watchs,
        count,
        page
      })
    })
  });
}

ctrl.save = async (req, res) => {
  let { video_id, user_id, title, image, year, score, seasons } = req.body;
  // console.log(video_id);
  let prevWatch = await WatchList.find({ video_id, user_id });
  if(prevWatch.length >= 1) {
    await WatchList.deleteOne({ video_id, user_id });
    res.json({
      success: true
    })
    return;
  }
  let newWatch = new WatchList({ video_id, user_id, title, image, year, score, seasons });
  await newWatch.save();
  res.json({
    success: true
  })
}

ctrl.delete = async (req, res) => {
  let { video_id, user_id } = req.body;
  let videoDelete = await WatchList.findOneAndDelete({ video_id, user_id }).catch((err) => {
    res.json({
      success: false
    })
  });
  // console.log(videoDelete);
  res.json({
    success: true
  });
}

ctrl.verifyVideo = async (req, res) => {
  
}

module.exports = ctrl;