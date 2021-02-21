const express = require('express');
const app = express();

const path = require('path');
const morgan = require('morgan');

const bcrypt = require('bcrypt');
const cors = require('cors');

const multer = require('multer');

const bodyParser = require('body-parser');

const LOCATION_URL_ORIGIN = process.env.LOCATION_URL_ORIGIN;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
FacebookStrategy = require('passport-facebook').Strategy,
OutlookStrategy = require('passport-outlook').Strategy;

const passport = require('passport'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
secretCookie = process.env.SECRET_COOKIE_PARSER,
PassportLocal = require('passport-local').Strategy;

const User = require('./models/User.model');

// settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(morgan('dev'));
let corsOptions = {
  origin: 'https://cotipelistv.herokuapp.com/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser(secretCookie));
const sessionMiddleware = session({
  secret: secretCookie,
  resave: true,
  saveUninitialized: true
})
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT USER STABLISHED WITH PASSPORTLOCAL
passport.use(new PassportLocal(async function(username, password, done) {
  let verifyUser = false;
  let idUser = 0;
  let nomUser = "";
  let fotoUser = "";
  let user = await User.findOne({ email: username }).catch((err) => console.log(err));
  let match;
  // console.log('Validado');
  if(user) {
    match = await bcrypt.compare(password, user.password);
  }
  if(match) {
    verifyUser = true;
    nomUser = user.name;
    idUser = user._id;
    fotoUser = user.foto;
  }
  if(verifyUser) {
    return done(null, {id: idUser, user:username, name: nomUser, foto: fotoUser});
  }
  done(null, false);
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${LOCATION_URL_ORIGIN}/google/callback`
},
function(accessToken, refreshToken, profile, done) {
    return done(null, {
      id: profile.id,
      user: profile.emails[0].value,
      name: profile.displayName,
      foto: profile.photos[0].value
    });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${LOCATION_URL_ORIGIN}/facebook/callback`,
  profileFields: ['id', 'email', 'displayName', 'photos']
},
function(accessToken, refreshToken, profile, done) {
  return done(null, {
    id: profile.id,
    user: profile.emails[0].value,
    name: profile.displayName,
    foto: profile.photos[0].value
  });
}
));

passport.use(new OutlookStrategy({
    clientID: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    callbackURL: `${LOCATION_URL_ORIGIN}/outlook/callback`,
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    return done(null, {
      id: profile.id.split('@')[1],
      user: profile.emails[0].value,
      name: profile.displayName,
      foto: 'https://yt3.ggpht.com/yti/ANoDKi56hUd0nUHBuxBHFhSaAPRGkufNNSNGi9TDYQ=s108-c-k-c0x00ffffff-no-rj'
  } );
  //'/img/avatar-login3.png'
  
    // return done(null, profile);
    // var user = {
    //   outlookId: profile.id,
    //   name: profile.DisplayName,
    //   email: profile.EmailAddress,
    //   accessToken: accessToken
    // };
    // if (refreshToken)
    //   user.refreshToken = refreshToken;
    // if (profile.MailboxGuid)
    //   user.mailboxGuid = profile.MailboxGuid;
    // if (profile.Alias)
    //   user.alias = profile.Alias;
    // User.findOrCreate(user, function (err, user) {
    //   return done(err, user);
    // });
  }
));

// SERIALIZAR USER
passport.serializeUser(function(user, done) {
  done(null, user);
});

// DESERIALIZAR USER
passport.deserializeUser(function(user, done) {
  done(null, user);
});


// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({
  dest: path.join(__dirname, "public/upload"),
  limits: { fieldSize: 202600000 }
}).single('archivo'));


// routes
app.use(require('./routes/index').router);   

// 404 handler
app.use((req, res, next) => {
  res.render('404', {
    title: 'CotiPelisTV'
  });
});

// starting the server
module.exports = {app};