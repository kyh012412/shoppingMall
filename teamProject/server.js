/* eslint-disable no-undef */
// 모듈
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
passportConfig();
const MySQLStore = require('express-mysql-session')(session);

const path = require('path');

const dbOption = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const sessionOption = {
  secret: '1234',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 1000 },
  store: new MySQLStore(dbOption),
};

//db
const db = require('./models');
const { Product } = db;

//미들웨어
// Build 폴더를 static 파일로 서빙
app.use(express.static(path.join(__dirname, 'build')));

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(passport.initialize());
app.use(session(sessionOption));
app.use(passport.session());

//api
app.listen(process.env.PORT, () => {
  console.log(`접속성공 - http://localhost:` + process.env.PORT);
});

app.use('/', require('./router'));

// 메인화면
app.get('/', async (req, res) => {
  const { order, sort } = req.query;
  let limit = parseInt(req.query.limit);
  let result;
  if (order && sort === 'asc') {
    result = await Product.findAll({
      order: [[order, 'asc']],
      limit,
    });
  } else if (order) {
    result = await Product.findAll({
      order: [[order, 'desc']],
      limit,
    });
  } else {
    result = await Product.findAll({
      limit,
    });
  }
  res.json(result);
});

// 모든 경로에 대해 index.html 반환
app.get('*', (req, res) => {
  console.log('Request path:', req.path);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
