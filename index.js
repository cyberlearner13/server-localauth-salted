const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

//DBSetup
mongoose.connect('mongodb://localhost:27017/auth/auth' ,{useNewUrlParser: true})

const app = express();

//App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({
  type: '*/*'
}));
router(app);
//a comment
//Server Setup
const port = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on port',port);
