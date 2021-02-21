const ctrl = {};
const WatchList = require('../models/WatchList.model');

ctrl.index = async (req, res) => {
  // let antPath = req.session.redirectTo;
  // res.redirect(antPath);
  // delete req.session.redirectTo;
  let watchlist = await WatchList.find({ user_id: req.user.id });
  res.json({
    success: true,
    user: req.user,
    watchlist
  });
}

ctrl.error = (req, res) => {
  res.json({
    success: false
  });
  // let antPath = req.session.redirectTo;
  // res.redirect(antPath);
  // delete req.session.redirectTo;
}

ctrl.successRedirect = (req, res) => {
  let antPath = req.session.redirectTo || '/';
  res.redirect(antPath);
  delete req.session.redirectTo;
}

ctrl.errorRedirect = (req, res) => {
  let antPath = req.session.redirectTo || '/';
  console.log(antPath);
  res.redirect(antPath);
  delete req.session.redirectTo;
}

module.exports = ctrl;