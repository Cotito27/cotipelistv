const ctrl = {};
const passport = require('passport');
const User = require('../models/User.model');

ctrl.verify = passport.authenticate('local',{
  successRedirect: "/success",
  failureRedirect: "/error"
});

ctrl.register = async (req, res) => {
  // console.log(req.headers);
  let { name, email, password } = req.body;
  let newData = {
    name, email, password
  }
  // console.log(newData, req.body);
  let oldUser = await User.findOne({ email });
  // console.log(oldUser);
  if(oldUser) {
    res.json({
      success: false
    })
    // res.send('El usuario ingresado ya existe');
    return;
  }
  let newUser = new User(newData);
  await newUser.save();
  res.json({
    success: true
  })
  // res.send('Fue registrado exitosamente');
}

ctrl.logout = (req, res) => {
  req.logout();
  res.json({
    success: true
  });
}

module.exports = ctrl;