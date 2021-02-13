const express = require('express');
const app = express();

const path = require('path');
const morgan = require('morgan');

const cors = require('cors');

// settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(cors({origin: '*'}));
app.use(express.urlencoded({extended: true}));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use(require('./routes/index').router);   

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({message: 'url not found'});
});

// starting the server
module.exports = {app};